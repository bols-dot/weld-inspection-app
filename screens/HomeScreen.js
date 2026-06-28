import React, { useContext } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeldContext } from '../context/WeldContext';

const HomeScreen = ({ navigation }) => {
  const { welds, deleteWeld } = useContext(WeldContext);

  const handleDelete = (id) => {
    Alert.alert(
      'Ta bort svets',
      'Är du säker på att du vill ta bort denna registrering?',
      [
        { text: 'Avbryt', onPress: () => {}, style: 'cancel' },
        {
          text: 'Ta bort',
          onPress: () => deleteWeld(id),
          style: 'destructive',
        },
      ]
    );
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Godkänd':
        return '#4CAF50';
      case 'Misslyckad':
        return '#f44336';
      case 'Väntar':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
  };

  const renderWeldItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { weld: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.weldInfo}>
          <Text style={styles.weldId}>{item.weldId}</Text>
          <Text style={styles.testDate}>{formatDate(item.testDate)}</Text>
        </View>
        <View
          style={[
            styles.resultBadge,
            { backgroundColor: getResultColor(item.testResult) },
          ]}
        >
          <Text style={styles.resultText}>{item.testResult}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.nextValidation}>
          Nästa validering: {formatDate(item.nextValidationDate)}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialCommunityIcons name="trash-can" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {welds.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="clipboard-alert"
            size={80}
            color="#ccc"
          />
          <Text style={styles.emptyText}>Ingen data ännu</Text>
          <Text style={styles.emptySubtext}>
            Börja med att lägga till ett nytt test
          </Text>
        </View>
      ) : (
        <FlatList
          data={welds}
          renderItem={renderWeldItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weldInfo: {
    flex: 1,
  },
  weldId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  testDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextValidation: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 10,
  },
});

export default HomeScreen;