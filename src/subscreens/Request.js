import React, { Component } from 'react';
import { KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet, Dimensions,TextInput,ActivityIndicator, Alert,Keyboard } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from 'firebase'
const width = Dimensions.get('window').width

export default class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            request:"",
            animate:false,
        };
    }

    updateRequest = async() => {
        Keyboard.dismiss();
        const { name , request  } = this.state;
        if(name != "") {
            if(request != ""){
                this.setState({animate:true})
                var newRequestKey = firebase.database().ref().push().key;
                await firebase.database().ref('Request/').child(newRequestKey).update({
                    name:name,
                    req :request
                }).then(res => {
                    this.setState({
                    animate:false,
                    name:"",
                    request:"",
                })
                Alert.alert("Thank you, we shall upload it soon")
                this.props.navigation.goBack();
            })
            }else{
                Alert.alert("Request field cannot be empty")
            } 
        }else{
            Alert.alert("Name cannot be empty")
        } 
    }

    render() {
        return (
            <LinearGradient colors={["#8458AB", "#6A468A"]} style={styles.mainApp}>

                <KeyboardAvoidingView behavior="padding" style={styles.textCancel}>
                    <Ionicons name="ellipsis-horizontal" size={40} color="#503568" />


                    <TextInput placeholder="Enter your name" placeholderTextColor={"#CC81FF"} style={styles.heading}
                        onChangeText={name => this.setState({ name: name })}
                        onBlur= {() => {Keyboard.dismiss()}}
                        value={this.state.name}
                    />


                </KeyboardAvoidingView>

                <KeyboardAvoidingView behavior="padding" style={{marginTop:20,}}> 


                    <TextInput placeholder="What do you want to see next ? " placeholderTextColor={"#CC81FF"} style={styles.heading}
                        onChangeText={reqname => this.setState({ request: reqname })}
                        onBlur= {() => {Keyboard.dismiss()}}
                        value={this.state.request}
                    />


                </KeyboardAvoidingView>

                <TouchableOpacity 
                onPress={this.updateRequest}
                style={{marginTop:20,backgroundColor:'#9663C3',padding:10,paddingHorizontal:15,borderRadius:10,}}>
                    <Text style={{color:"#CC81FF", fontFamily:'RalewayM',fontSize:17,}}>Submit</Text>
                </TouchableOpacity>
                <ActivityIndicator size={28} style={{margin:10}} animating={this.state.animate} color="#DD93FF" />
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
        width:width-20,
        backgroundColor: '#9663C3',
        color: '#fff',
        fontSize: 17,
        fontFamily: 'RalewayM',
        // textAlign: 'center'
        paddingLeft:10,
        padding:5,
        paddingVertical:8.3,
        borderWidth:0,
        borderColor:"#503568",
        borderRadius:5,
      },
})