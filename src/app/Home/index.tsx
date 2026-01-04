import { View, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { styles } from './Styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { FilterStatus } from '@/types/FilterStatus';
import { Item } from '@/components/Item';
import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.DONE,
  FilterStatus.PENDING,
];

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING);
 
  function updateFilter(status: FilterStatus) {
    setFilter(status);
  }

  const [description, setDescription] = useState('');
  const [Items, setItems] = useState<ItemStorage[]>([]);
  
  async function handleAdd(){
    if (!description.trim()) {
      return Alert.alert('Descrição inválida', 'Por favor, insira uma descrição válida para o item.');
    } 
    const newItem = {
      id: Math.random().toString(36).substring(2),
      description: description,
      status: FilterStatus.PENDING,
    };
    await itemsStorage.add(newItem);
    await itemsByStatus();
    Alert.alert('Adicionado', `${description} adicionado com sucesso!`);
    setDescription('');
  }

  async function itemsByStatus(){
    try {
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens.');
    }
  }
  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id);
      await itemsByStatus();
      Alert.alert('Removido', `Item removido com sucesso!`);
    } catch (error) {
      Alert.alert('Remover', 'Não foi possível remover o item.');
    }
  }

  async function handleClear() {
    Alert.alert(
      'Limpar Itens', 'Tem certeza que deseja limpar todos os itens?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
          },
        {
          text: 'Sim',
          onPress: async () => {
            try {   
              await itemsStorage.clear();
              setItems([]);
              Alert.alert('Limpo', 'Todos os itens foram removidos com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar os itens.');
            }
          }
        }

      ]
    );
  }

  async function handleToggleStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id);
      await itemsByStatus();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status do item.');
    }
  }

  useEffect(() => {
    itemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <View style={styles.form}>
        <Input placeholder="O que você precisa comprar?" 
          onChangeText={setDescription} 
          value={description}
        />
        <Button onPress={handleAdd} title="Adicionar" activeOpacity={0.8} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter
                key={status}
                status={status}
                isActive = {status === filter}
                onPress={() => updateFilter(status)}
              />
            ))
          }
          <TouchableOpacity  style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={Items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Item 
              data={item} 
              onStaus={() => handleToggleStatus(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() =>
            <View style={styles.separator} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={()=> <Text style={styles.empty}>Nenhum item encontrado</Text>}
        />
      </View>
    </View>
  );
}

