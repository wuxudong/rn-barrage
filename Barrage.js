import React from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

export default class Barrage extends React.Component {
    constructor() {
        super();

        this.num = 8
        this.queue = []
        this.busy = Array.from(new Array(this.num), (val, index) => false)

        this.state = {
            movingAnimations: Array.from(new Array(this.num), (val, index) => new Animated.ValueXY({
                x: -200,
                y: index * 40
            })),
            movingTexts: Array.from(new Array(this.num), (val, index) => "")
        }
    }

    offer(s) {
        this.queue.push(s)
        this.startAnimationIfNecessary()
    }

    take() {
        if (this.queue.length > 0) {
            let s = this.queue[0]
            this.queue = this.queue.slice(1, -1)
            return s
        } else {
            return "";
        }
    }

    startAnimationIfNecessary() {
        console.log(this.queue)

        let busyTrackCount = this.busy.reduce((sum, busy) => (sum += busy ? 1 : 0), 0)

        if (busyTrackCount < this.num) {
            // find a free track
            let s = this.take()

            if (s.length == 0) {
                return
            } else {

                let leftTrackCount = this.num - busyTrackCount

                let selectIndex = Math.floor(Math.random() * leftTrackCount)

                var j = 0
                for (var i = 0; i < this.num; i++) {
                    if (this.busy[i]) {
                        continue
                    } else {
                        if (j == selectIndex) {
                            this.startAnimation(i, s)
                            break
                        } else {
                            j++
                        }

                    }
                }
            }
        }

    }

    startAnimation(index, text) {

        console.log("barrage " + text + " at track " + index)

        let _this = this

        var movingTextsCopy = this.state.movingTexts.slice()
        movingTextsCopy[index] = text
        this.setState({...this.state, movingTexts: movingTextsCopy})

        this.busy[index] = true

        Animated.timing(                  // Animate over time
            this.state.movingAnimations[index],            // The animated value to drive
            {
                toValue: {x: 200, y: index * 40},                   // Animate to opacity: 1 (opaque)
                duration: 5000,              // Make it take a while
            }
        ).start(() => {
            var movingAnimationsCopy = _this.state.movingAnimations.slice()
            movingAnimationsCopy[index] = new Animated.ValueXY({
                x: -200,
                y: index * 40
            })

            var movingTextsCopy = _this.state.movingTexts.slice()
            movingTextsCopy[index] = ""

            _this.busy[index] = false

            _this.setState({...this.state, movingAnimations: movingAnimationsCopy, movingTexts: movingTextsCopy})

            _this.startAnimationIfNecessary()

        });

    }

    getStyle(index) {
        let translateTransform = this.state.movingAnimations[index].getTranslateTransform();
        // console.log(translateTransform)
        return [{
            transform: translateTransform
        }]
    }

    render() {
        return (
            <View style={styles.container}>
                {Array.from(new Array(this.num), (val, index) =>
                    <Animated.View key={index} style={this.getStyle(index)}>
                        <Text>{this.state.movingTexts[index]}</Text>

                    </Animated.View>)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 600,
        height: 600,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
