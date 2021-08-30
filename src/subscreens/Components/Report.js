import React, { Component } from 'react';
import { KeyboardAvoidingView, View, TouchableOpacity, Text, StyleSheet, Dimensions, TextInput, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from 'firebase'
const width = Dimensions.get('window').width

export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animeName: "",
            name: "",
            report: "",
            animate: false,
        };
    }

    componentDidMount = () => {
        const name = this.props.navigation.getParam("animeName", "some value");
        this.setState({
            animeName: name
        })
    }

    updateRequest = async () => {
        Keyboard.dismiss();
        const { name, report, animeName } = this.state;
        if (name != "") {
            if (report != "") {
                this.setState({ animate: true })
                var newRequestKey = firebase.database().ref().push().key;
                await firebase.database().ref('Report/').child(newRequestKey).update({
                    name: name,
                    rep: report,
                    anime: animeName
                }).then(res => {
                    this.setState({
                        animate: false,
                        name: "",
                        report: "",
                    })
                    Alert.alert("Thank you, we shall fix it soon")
                    this.props.navigation.goBack();
                })
            } else {
                Alert.alert("Report field cannot be empty")
            }
        } else {
            Alert.alert("Name cannot be empty")
        }
    }

    render() {
        const { animeName } = this.state;

        return (
            <LinearGradient colors={["#8458AB", "#6A468A"]} style={styles.mainApp}>

                <KeyboardAvoidingView behavior="padding" style={styles.textCancel}>
                    <Ionicons name="ellipsis-horizontal" style={{marginBottom:-5,}} size={40} color="#503568" />
                    <View style={{ justifyContent: 'center', alignItems: 'center',marginBottom:20, }}>
                        <Text style={{
                            marginLeft: 10,
                            fontFamily: 'Poppins',
                            fontSize: 19,
                            color: '#A48FF4'
                        }}>{animeName}</Text>
                    </View>
                    <TextInput placeholder="Enter your name" placeholderTextColor={"#CC81FF"} style={styles.heading}
                        onChangeText={name => this.setState({ name: name })}
                        onBlur= {() => {Keyboard.dismiss()}}
                        value={this.state.name}
                    />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView behavior={'padding'} style={{ marginTop: 20, }}>
                    <TextInput placeholder="Describe your problem in short..." placeholderTextColor={"#CC81FF"} style={styles.heading}
                        onChangeText={name => this.setState({ report: name })}
                        onBlur= {() => {Keyboard.dismiss()}}
                        value={this.state.report}
                    />
                </KeyboardAvoidingView>
                <TouchableOpacity
                    onPress={this.updateRequest}
                    style={{ marginTop: 20, backgroundColor: '#9663C3', padding: 10, paddingHorizontal: 15, borderRadius: 10, }}>
                    <Text style={{ color: "#CC81FF", fontFamily: 'RalewayM', fontSize: 17, }}>Submit</Text>
                </TouchableOpacity>
                <ActivityIndicator size={28} style={{ margin: 10 }} animating={this.state.animate} color="#DD93FF" />
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    mainApp: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textCancel: {
        marginTop: 0,
        alignItems: 'center',
    },
    mainText: {
        textAlign: 'center',
        color: "#fff",
        fontFamily: 'Poppins',
        fontSize: 17,
    },
    heading: {
        width: width - 20,
        backgroundColor: '#9663C3',
        color: '#fff',
        fontSize: 17,
        fontFamily: 'RalewayM',
        // textAlign: 'center'
        paddingLeft: 10,
        padding: 5,
        paddingVertical: 8.3,
        borderWidth: 0,
        borderColor: "#503568",
        borderRadius: 5,

        borderBottomColor: "#503568",
    },
})