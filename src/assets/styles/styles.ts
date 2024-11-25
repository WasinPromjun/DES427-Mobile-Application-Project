import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  group: {
    marginTop: 20,
  },
  center: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 20,
    color: 'blue',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 30,
  },
  feedImage: {
    width: 350,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  searchcontainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent:'center',
    width: '100%',
    height: 47,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    justifyContent:'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  following: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  notFollowing: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default styles;