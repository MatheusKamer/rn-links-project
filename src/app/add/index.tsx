import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { linkStorage } from "@/storage/link-storage";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Categories } from "@/components/categories";

export default function Add() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function handleAdd() {
    try {
      if (!category.trim()) {
        return Alert.alert("Categoria", "Seleciona uma categoria!");
      }

      if (!name.trim()) {
        return Alert.alert("Nome", "Preencha o nome!");
      }

      if (!url.trim()) {
        return Alert.alert("URL", "Preencha a URL!");
      }

      await linkStorage.save({
        id: new Date().getTime().toString(),
        category,
        name,
        url,
      });

      Alert.alert("Sucesso", "Link adicionado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Erro ao adicionar o link!");
    }
  }

  function handleCategoryChange(value: string) {
    value === category ? setCategory("") : setCategory(value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={32} color={colors.gray[200]} />
        </TouchableOpacity>

        <Text style={styles.title}>Novo</Text>
      </View>

      <Text style={styles.label}>Selecione uma categoria</Text>

      <Categories onChange={handleCategoryChange} selected={category} />

      <View style={styles.form}>
        <Input placeholder="Nome" onChangeText={setName} autoCorrect={false} />
        <Input
          placeholder="URL"
          onChangeText={setUrl}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>
    </View>
  );
}
