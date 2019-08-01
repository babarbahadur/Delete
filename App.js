import React, {Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Picker,
  Platform
} from 'react-native';

  const screen = Dimensions.get("window");

  const formatNumber = number => `0${number}`.slice(-2)

  const getRemaining = time => {
  minutes = Math.floor(time/60),
  seconds = time - minutes * 60

  return {minutes: formatNumber(minutes), seconds: formatNumber(seconds)}
}

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5"
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if(this.state.remainingSeconds === 0 && prevState.remainingSeconds !==0) {
      this.stop();
    }
  }

  componentWillUnmount() {
    if(this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds:
      parseInt(state.selectedMinutes, 10) * 60 +
      parseInt(state.selectedSeconds, 10),
      isRunning: true
    }));

    this.interval = setInterval( () => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }))
    }, 1000);
  }

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({remainingSeconds: 5,
    isRunning: false
    });

  }

  renderPickers = () => { 
    return(
      <View style = {styles.pickerContainer}>
        <Picker
        style={styles.picker}
        itemStyle = {styles.pickerItem}
        selectedValue = '3'
        onValueChange = {itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}>
          {AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}

        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
        style={styles.picker}
        itemStyle = {styles.pickerItem}
        selectedValue = '3'
        onValueChange = {itemValue => {
          this.setState({ selectedSeconds: itemValue });
        }}>
          {AVAILABLE_SECONDS.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    )
  }

  render() {
    const {minutes, seconds} = getRemaining(this.state.remainingSeconds)

    return (
      <Fragment>
        <StatusBar barStyle= "light-content" />
          <View style = {styles.container}>

          {this.state.isRunning ? 
            ( <Text style={styles.timeTextView}>{`${minutes}:${seconds}`}</Text>) : 
            (this.renderPickers())}


          {this.state.isRunning ? (
            <TouchableOpacity
            onPress = {this.stop}>
            <View style= { styles.circleStop}>
              <Text style={styles.textViewStop}>Stop</Text>
            </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
            onPress = {this.start}>
            <View style= { styles.circle}>
              <Text style={styles.textView}>Start</Text>
            </View>
            </TouchableOpacity>)}
          </View>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B9B7B7",
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    borderWidth: 10,
    borderColor: "#2270CA",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textView: {
    fontSize: 50,
    color: '#2270CA'
  },
  timeTextView: {
    fontSize: 80,
    color: '#FFFFFF',
    paddingBottom: 20
  },
  circleStop: {
    borderWidth: 10,
    borderColor: "#DC5D09",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textViewStop: {
    fontSize: 50,
    color: '#DC5D09'
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
       // backgroundColor: "#07121B",
        marginLeft: 10
      }
    })
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default App;