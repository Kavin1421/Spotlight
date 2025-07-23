import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View >
      <Text >Hello Dilip Bro!!</Text>
      <Link href={"/notifications"}>Feed Screens in Tabs</Link>
    </View>
  );
}
