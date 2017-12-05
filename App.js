import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

import Barrage from './Barrage'

export default class App extends React.Component {
    fireBarrage() {
        this.refs.barrage.offer("" + Math.random())
    }

    componentDidMount() {
        setInterval(() => {
            this.fireBarrage()
        }, 500)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>hello</Text>
                <Button onPress={this.fireBarrage.bind(this)} title="fire"/>
                <Barrage ref="barrage"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
