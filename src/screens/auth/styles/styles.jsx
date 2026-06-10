import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 35,
    fontWeight: 'bold',
  },

  headingTextMedium: {
    fontSize: 27,
    fontWeight: '700',
  },

  buttonRed: {
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#de3434',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    textTransform: 'capitalize',
    width: '100%',
    textAlign: 'center',
  }
})

export default styles