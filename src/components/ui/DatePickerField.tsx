import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import { useThemeColors, spacing, borderRadius, fontSize } from '../../theme';

interface DatePickerFieldProps {
  label: string;
  value: string; // 'yyyy-MM-dd'
  onChange: (value: string) => void;
  error?: string;
}

export function DatePickerField({ label, value, onChange, error }: DatePickerFieldProps) {
  const colors = useThemeColors();
  const [show, setShow] = useState(false);

  const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : new Date();

  function handleChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(format(selected, 'yyyy-MM-dd'));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      {Platform.OS === 'ios' ? (
        <View
          style={[
            styles.iosPickerWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.negative : colors.border,
            },
          ]}
        >
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="compact"
            onChange={handleChange}
            style={styles.iosPicker}
          />
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setShow(true)}
            style={[
              styles.pressable,
              {
                backgroundColor: colors.surface,
                borderColor: error ? colors.negative : colors.border,
              },
            ]}
          >
            <Text style={{ color: value ? colors.text : colors.textSecondary, fontSize: fontSize.md }}>
              {value || 'Selecionar data'}
            </Text>
          </Pressable>

          {show && (
            <DateTimePicker value={dateValue} mode="date" display="default" onChange={handleChange} />
          )}
        </>
      )}

      {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}
    </View>
  );
}

interface TimePickerFieldProps {
  label: string;
  value: string; // 'HH:mm'
  onChange: (value: string) => void;
}

export function TimePickerField({ label, value, onChange }: TimePickerFieldProps) {
  const colors = useThemeColors();
  const [show, setShow] = useState(false);

  const timeValue = value ? parse(value, 'HH:mm', new Date()) : new Date();

  function handleChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(format(selected, 'HH:mm'));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      {Platform.OS === 'ios' ? (
        <View
          style={[
            styles.iosPickerWrapper,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <DateTimePicker
            value={timeValue}
            mode="time"
            display="compact"
            onChange={handleChange}
            style={styles.iosPicker}
          />
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setShow(true)}
            style={[
              styles.pressable,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: value ? colors.text : colors.textSecondary, fontSize: fontSize.md }}>
              {value || 'Selecionar hora'}
            </Text>
          </Pressable>

          {show && (
            <DateTimePicker value={timeValue} mode="time" display="default" is24Hour onChange={handleChange} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, marginBottom: spacing.xs, fontWeight: '500' },
  pressable: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
  },
  iosPickerWrapper: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 2,
    alignItems: 'flex-start',
  },
  iosPicker: { height: 40 },
  error: { fontSize: fontSize.xs, marginTop: spacing.xs },
});
