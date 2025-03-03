import { Text, Pressable, PressableProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { styles } from "./styles";

type CategoryProps = PressableProps & {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export function Category({ name, icon, ...rest }: CategoryProps) {
  return (
    <Pressable style={styles.container} onPress={rest.onPress}>
      <MaterialIcons name={icon} size={16} color={colors.gray[400]} />
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}
