import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ImageBackground,TouchableOpacity } from 'react-native'
//import { TouchableOpacity } from "react-native-gesture-handler"
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default class Card extends Component {
    
    render() {
        const {title, imgURL, ep, plot,id} =  this.props;
        return (
            <TouchableOpacity style={styles.mainCard} onPress={() => this.props.nav.navigate("anim",{
                name: title,
                img: imgURL,
                eps:ep,
                plot:plot,   
                id:id,
              }) }>
                <View style={styles.imageHolder}>
                    <ImageBackground
                        style={styles.image}
                        imageStyle={{ borderRadius: 10 }}
                        source={{ uri: imgURL }}
                    ></ImageBackground>
                </View>
                <View style={styles.textHolder}>
                    <Text style={styles.cardText}>{title.length > 31 ? title.substring(0,31) +"...": title}</Text>
                    <Text style={styles.cardEpText}>Episodes : {ep}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    mainCard: {
        // backgroundColor:'aqua',
        // height: height/2.3,
        width: width /2.3,
        flex:1,
        marginVertical: 13,
        justifyContent:'center',
        alignItems:'center'
    },
    cardText: {
        textAlign:'left',
        fontFamily: 'RalewayM',
        color: '#A48FF4',
        fontSize: 17,
        marginLeft: 7,
        flexWrap:'wrap'
    },
    image: {
        // justifyContent:'center',
        // alignItems:'center',
        height: height / 3.2,
        width: width / 2.3,
    },
    textHolder:{
        marginTop:5,
        flex: 1, 
        width: width / 2.3,
        alignItems:'flex-start',
        justifyContent:'flex-start',
        // backgroundColor:'green',
    },
    imageHolder:{
        flex:0,
        // backgroundColor:'red',
    },
    cardEpText:{
        fontFamily: 'RalewayM',
        color: '#B6A6CB',
        fontSize: 17,
        marginLeft: 7,
        flexWrap:'wrap'
    }
})

