import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { ActivityIndicator, Avatar, Button } from "react-native-paper";
import { db } from "./services/firebase";
import { getAllUsers } from "./services/users";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp?: any;
}

export default function ChatScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const navigation = useNavigation();

  const normalizeUsername = (name: string) => name.trim().toLowerCase();

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) {
        navigation.navigate("Login" as never);
        return;
      }
      const parsed = JSON.parse(stored);
      const normalized = normalizeUsername(parsed.username || parsed.name);
      setCurrentUser({ ...parsed, username: normalized });
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      try {
        const all = await getAllUsers();
        const filtered = all.filter(
          (u: any) =>
            normalizeUsername(u.username) !== normalizeUsername(currentUser.username)
        );

        const normalized = filtered.map((u: any) => ({
          ...u,
          username: normalizeUsername(u.username),
        }));

        setUsers(normalized);
      } catch (e) {
        console.error("Error loading users:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      return;
    }

    const chatId = [currentUser.username, selectedUser.username].sort().join("_");
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Message),
        id: doc.id,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !selectedUser) return;

    const chatId = [currentUser.username, selectedUser.username].sort().join("_");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      sender: currentUser.username,
      content: input.trim(),
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  if (loading || !currentUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Left User List */}
      <View style={styles.sidebar}>
        <Text style={styles.heading}>Chats</Text>
        <ScrollView>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userCard,
                selectedUser?.username === user.username && styles.userCardSelected,
              ]}
              onPress={() => setSelectedUser(user)}
            >
              <Avatar.Text label={user.username[0].toUpperCase()} size={36} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.role}>{user.roles?.[0] || "User"}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Right Chat Section */}
      <View style={styles.chatArea}>
        {selectedUser ? (
          <>
            {/* User Header */}
            <View style={styles.chatHeader}>
              <Avatar.Text label={selectedUser.username[0].toUpperCase()} size={36} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.username}>{selectedUser.username}</Text>
                <Text style={styles.role}>{selectedUser.roles?.[0] || "User"}</Text>
              </View>
            </View>

            {/* Messages */}
            <ScrollView style={styles.messageList}>
              {messages.map((msg) => {
                const isMe = msg.sender === currentUser.username;
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      isMe ? styles.myMessage : styles.otherMessage,
                    ]}
                  >
                    <Text style={styles.senderText}>{isMe ? "You" : msg.sender}</Text>
                    <Text>{msg.content}</Text>
                    {msg.timestamp?.toDate && (
                      <Text style={styles.timeText}>
                        {new Date(msg.timestamp.toDate()).toLocaleTimeString()}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={80}
              style={styles.inputContainer}
            >
              <TextInput
                placeholder="Type your message..."
                style={styles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
              />
              <Button mode="contained" style={styles.sendButton} onPress={sendMessage}>
                Send
              </Button>
            </KeyboardAvoidingView>
          </>
        ) : (
          <View style={styles.center}>
            <Text style={{ color: "gray" }}>Select a user to start chatting</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: { width: 120, backgroundColor: "#fff", padding: 10 },
  heading: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  userCardSelected: { backgroundColor: "#bbf7d0" },
  username: { fontWeight: "bold" },
  role: { fontSize: 12, color: "gray" },
  chatArea: { flex: 1, backgroundColor: "#f0fdf4", padding: 10 },
  chatHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  messageList: { flex: 1 },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#a7f3d0",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  senderText: { fontSize: 12, color: "gray", marginBottom: 3 },
  timeText: { fontSize: 10, color: "gray", marginTop: 5, textAlign: "right" },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
    sendButton: {
        backgroundColor: "#34d399",
        borderRadius: 25,
    },
  
});
