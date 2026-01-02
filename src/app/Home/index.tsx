import { View, Image, TouchableOpacity, Text } from 'react-native';
import { styles } from './Styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { FilterStatus } from '@/types/FilterStatus';
import { Item } from '@/components/Item';
import { FlatList } from 'react-native';

const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.DONE,
  FilterStatus.PENDING,
];

const Items = [
  {
    id: '1',
    description: 'Leite',
    status: FilterStatus.DONE
  },
  {
    id: '2',
    description: 'Café',
    status: FilterStatus.PENDING
  },
  {
    id: '3',
    description: 'Pão',
    status: FilterStatus.DONE
  },
]


export function Home() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <View style={styles.form}>
        <Input placeholder="O que você precisa comprar?" />
        <Button title="Adicionar" activeOpacity={0.8} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter
                key={status}
                status={status}
                isActive
              />
            ))
          }
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={Items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Item 
              data={item} 
              onStaus={() => console.log("Status changed")}
              onRemove={() => console.log("Item removed")}
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

