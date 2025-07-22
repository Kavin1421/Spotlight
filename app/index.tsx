import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Hello Kavin Bro!!</Text>
      <TouchableOpacity onPress={() => alert("Button Pressed!")}>
        <Text style={styles.button}>Press Me</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/images/react-logo.png")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}
