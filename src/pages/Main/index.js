import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import {
  Container,
  Form,
  SubmitButton,
  Input,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  UnfollowButton,
  UnfollowButtonText,
} from './styles';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    error: false,
  };

  // busca os dados.
  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  // ira executar quando tiver alteracoes no estado.
  componentDidUpdate(_, prevState) {
    const { users } = this.state;
    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleNavigate = user => {
    const { navigation } = this.props;
    navigation.navigate('User', { user });
  };

  handleRemoveUser = async user => {
    const { users } = this.state;

    const filtered = users.filter(value => {
      return value !== user;
    });

    this.setState({ users: filtered });
  };

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true, error: false });

    try {
      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      // Verificando se o usuario já está na lista.
      const userExist = users.find(u => u.login === data.login);
      if (userExist) throw Error('Você já adicionou este usuário!');

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      // Faz o teclado sumir.
      Keyboard.dismiss();
    } catch (err) {
      this.setState({ error: true });
      Alert.alert(err.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  static navigationOptions = {
    title: 'Usuários',
  };

  render() {
    const { users, newUser, loading, error } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            error={error}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send" // Coloca botao de send no teclado
            onSubmitEditing={this.handleAddUser} // Para chamar a funcao pelo botao que colocamos no teclado.
          />
          <SubmitButton onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <UnfollowButton onPress={() => this.handleRemoveUser(item)}>
                <UnfollowButtonText>X</UnfollowButtonText>
              </UnfollowButton>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>VER PERFIL</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
