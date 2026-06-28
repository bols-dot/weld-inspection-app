import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeldContext } from '../context/WeldContext';

const DetailScreen = ({ route, navigation }) => {
  const { weld } = route.params;
  const { updateWeld, deleteWeld } = useContext(WeldContext);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE') + ' ' + date.toLocaleTimeString('sv-SE');
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

  const getDaysUntilValidation = () => {
    const nextDate = new Date(weld.nextValidationDate);
    const today = new Date();
    const diff = Math.floor((nextDate - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleDelete = () => {
    Alert.alert(
      'Ta bort',
      'Är du säker på att du vill ta bort denna registrering?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          onPress: () => {
            deleteWeld(weld.id);
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const daysLeft = getDaysUntilValidation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.weldId}>{weld.weldId}</Text>
            <Text style={styles.subtext}>
              Registrerad: {formatDateTime(weld.createdAt)}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: getResultColor(weld.testResult) },
            ]}
          >
            <Text style={styles.badgeText}>{weld.testResult}</Text>
          </View>
        </View>

        {/* Validering info */}
        <View
          style={[
            styles.card,
            daysLeft < 30 && { borderLeftWidth: 4, borderLeftColor: '#f44336' },
          ]}
        >
          <View style={styles.cardRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color="#2196F3"
            />
            <View style={styles.cardText}>
              <Text style={styles.label}>Test-datum</Text>
              <Text style={styles.value}>{formatDate(weld.testDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <MaterialCommunityIcons
              name="calendar-alert"
              size={20}
              color={daysLeft < 30 ? '#f44336' : '#4CAF50'}
            />
            <View style={styles.cardText}>
              <Text style={styles.label}>Nästa validering</Text>
              <Text style={styles.value}>{formatDate(weld.nextValidationDate)}</Text>
              <Text
                style={[
                  styles.daysLeft,
                  daysLeft < 30 && { color: '#f44336' },
                ]}
              >
                {daysLeft > 0 ? `${daysLeft} dagar kvar` : 'Förfallen!'}
              </Text>
            </View>
          </View>
        </View>

        {/* Testresultat */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={getResultColor(weld.testResult)}
            />
            <View style={styles.cardText}>
              <Text style={styles.label}>Testresultat</Text>
              <Text style={styles.value}>{weld.testResult}</Text>
            </View>
          </View>
        </View>

        {/* Noteringar */}
        {weld.notes ? (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons
                name="note-text"
                size={20}
                color="#FF9800"
              />
              <View style={styles.cardText}>
                <Text style={styles.label}>Noteringar</Text>
                <Text style={styles.notesValue}>{weld.notes}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="trash-can" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ta bort</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  weldId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardText: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 5,
  },
  daysLeft: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: '600',
  },
  notesValue: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default DetailScreen;