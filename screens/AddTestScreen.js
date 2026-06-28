import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeldContext } from '../context/WeldContext';

const AddTestScreen = ({ navigation }) => {
  const { addWeld } = useContext(WeldContext);
  const [weldId, setWeldId] = useState('');
  const [testDate, setTestDate] = useState(new Date());
  const [showTestDatePicker, setShowTestDatePicker] = useState(false);
  const [testResult, setTestResult] = useState('Godkänd');
  const [notes, setNotes] = useState('');

  const handleTestDateChange = (event, selectedDate) => {
    setShowTestDatePicker(false);
    if (selectedDate) {
      setTestDate(selectedDate);
    }
  };

  const getNextValidationDate = () => {
    const nextDate = new Date(testDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    return nextDate;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('sv-SE');
  };

  const handleSubmit = () => {
    if (!weldId.trim()) {
      Alert.alert('Fel', 'Vänligen ange svets-ID');
      return;
    }

    if (!testResult) {
      Alert.alert('Fel', 'Vänligen välj testresultat');
      return;
    }

    const nextValidationDate = getNextValidationDate();

    addWeld({
      weldId: weldId.trim(),
      testDate: testDate.toISOString(),
      nextValidationDate: nextValidationDate.toISOString(),
      testResult,
      notes: notes.trim(),
    });

    Alert.alert('Klart!', 'Testet har registrerats', [
      {
        text: 'OK',
        onPress: () => {
          setWeldId('');
          setNotes('');
          setTestDate(new Date());
          setTestResult('Godkänd');
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Svets-ID */}
        <View style={styles.section}>
          <Text style={styles.label}>Svets-ID</Text>
          <TextInput
            style={styles.input}
            placeholder="T.ex. SV-2024-001"
            value={weldId}
            onChangeText={setWeldId}
            placeholderTextColor="#ccc"
          />
        </View>

        {/* Test-datum */}
        <View style={styles.section}>
          <Text style={styles.label}>Test-datum</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowTestDatePicker(true)}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color="#2196F3"
            />
            <Text style={styles.dateButtonText}>{formatDate(testDate)}</Text>
          </TouchableOpacity>
          {showTestDatePicker && (
            <DateTimePicker
              value={testDate}
              mode="date"
              display="spinner"
              onChange={handleTestDateChange}
            />
          )}
        </View>

        {/* Nästa validering */}
        <View style={styles.section}>
          <Text style={styles.label}>Nästa validering</Text>
          <View style={styles.dateDisplay}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color="#4CAF50"
            />
            <Text style={styles.dateDisplayText}>
              {formatDate(getNextValidationDate())}
            </Text>
          </View>
          <Text style={styles.hint}>Automatisk +1 år från testdatum</Text>
        </View>

        {/* Testresultat */}
        <View style={styles.section}>
          <Text style={styles.label}>Testresultat</Text>
          <View style={styles.resultButtons}>
            {['Godkänd', 'Misslyckad', 'Väntar'].map((result) => (
              <TouchableOpacity
                key={result}
                style={[
                  styles.resultButton,
                  testResult === result && styles.resultButtonActive,
                ]}
                onPress={() => setTestResult(result)}
              >
                <Text
                  style={[
                    styles.resultButtonText,
                    testResult === result && styles.resultButtonTextActive,
                  ]}
                >
                  {result}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Noteringar */}
        <View style={styles.section}>
          <Text style={styles.label}>Noteringar (valfritt)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Lägg till noteringar här..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor="#ccc"
            textAlignVertical="top"
          />
        </View>

        {/* Skicka-knapp */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#fff"
          />
          <Text style={styles.submitButtonText}>Registrera test</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  dateDisplay: {
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDisplayText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  resultButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  resultButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  resultButtonTextActive: {
    color: '#2196F3',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AddTestScreen;