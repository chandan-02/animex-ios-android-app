import React, { Component } from 'react';
import {View,TouchableOpacity,Text,StyleSheet,Dimensions} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const width  =  Dimensions.get('window').width

export default class End extends Component {
    render(){
        return (
            <TouchableOpacity style={styles.mainContainer} onPress={() => this.props.nav.navigate('request') }>
                <LinearGradient colors={["#8458AB", "#6A468A"]}  style={styles.mainApp}>
                    <Text style={styles.mainText}>Missing Something ? Click here </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        justifyContent:'center',
        alignItems:'center',
        margin:20
    },
    mainApp:{
        borderRadius:10,
        padding:10,
        width:width/1.5,
        // backgroundColor:'red'
    },
    mainText :{
        textAlign:'center',
        color:"#fff",
        fontFamily:'Poppins',
        fontSize:14,
    }
})