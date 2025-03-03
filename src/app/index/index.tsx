import { Text, View } from "react-native";
import { styles } from "./styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <Text style={styles.title}>React Native!</Text>
    </View>
  );
}
