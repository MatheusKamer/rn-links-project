import {
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { linkStorage, LinkStorage } from "@/storage/link-storage";

import { Link } from "@/components/link";
import { Option } from "@/components/option";
import { Categories } from "@/components/categories";

export default function Index() {
  const [links, setLinks] = useState<LinkStorage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedLink, setSelectedLink] = useState<LinkStorage>(
    {} as LinkStorage
  );

  async function getLinks() {
    try {
      const response = await linkStorage.get();
      const filteredLinks = response.filter((link) =>
        category ? link.category === category : true
      );

      return setLinks(filteredLinks);
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar links");
    }
  }

  async function removeLink() {
    try {
      await linkStorage.remove(selectedLink.id);
      setIsOpen(false);
      getLinks();
    } catch (error) {
      Alert.alert("Erro", "Erro ao remover link");
    }
  }

  function handleRemoveLink() {
    Alert.alert("Remover", "Deseja realmente excluir este link?", [
      { style: "cancel", text: "Cancelar" },
      {
        style: "destructive",
        text: "Remover",
        onPress: removeLink,
      },
    ]);
  }

  async function handleOpenLink() {
    try {
      await Linking.openURL(selectedLink.url);
      setIsOpen(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o link");
    }
  }

  function handleCategoryChange(value: string) {
    value === category ? setCategory("") : setCategory(value);
  }

  function handleDetails(selected: LinkStorage) {
    setSelectedLink(selected);
    setIsOpen(true);
  }

  useFocusEffect(
    useCallback(() => {
      getLinks();
    }, [category])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => router.navigate("/add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>

      <Categories onChange={handleCategoryChange} selected={category} />

      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal transparent visible={isOpen} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>{selectedLink.category}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLinkName}>{selectedLink.name}</Text>
            <Text style={styles.modalUrl}>{selectedLink.url}</Text>

            <View style={styles.modalFooter}>
              <Option
                name="Excluir"
                icon="delete"
                variant="secondary"
                onPress={handleRemoveLink}
              />
              <Option name="Abrir" icon="language" onPress={handleOpenLink} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
