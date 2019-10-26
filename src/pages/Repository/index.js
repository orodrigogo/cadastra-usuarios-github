import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').html_url,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    return (
      <WebView
        source={{ uri: navigation.getParam('repository').html_url }}
        style={{ flex: 1 }}
      />
    );
  }
}
