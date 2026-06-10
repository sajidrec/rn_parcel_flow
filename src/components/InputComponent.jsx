import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

/**
 * Props:
 *  label        {string}  — label shown above input
 *  value        {string}  — controlled value
 *  onChangeText {func}    — change handler
 *  type         {string}  — 'text' | 'email' | 'password'  (default: 'text')
 *  error        {string}  — red error message below input
 *  placeholder  {string}  — placeholder text
 */

const TYPE_CONFIG = {
  text: {
    keyboardType: 'default',
    secureTextEntry: false,
  },
  email: {
    keyboardType: 'email-address',
    secureTextEntry: false,
  },
  password: {
    keyboardType: 'default',
    secureTextEntry: true,
  },
}

const InputComponent = ({
  label = '',
  value = '',
  onChangeText = null,
  type = 'text',
  error,
  placeholder = '',
  inputWidth = '100%',
  ...rest
}) => {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.text
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={[styles.wrapper, { width: inputWidth }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputRow, focused && styles.inputRowFocused, error && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={config.keyboardType}
          secureTextEntry={type === 'password' && !showPassword}
          {...rest}
        />

        {type === 'password' && (
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
            <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

export default InputComponent

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputRowFocused: {
    borderColor: '#6366F1',
  },
  inputRowError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 11,
  },
  toggle: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
    paddingLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },
})