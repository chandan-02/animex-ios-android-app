import React, { Component } from 'react'
import {View,StyleSheet,Text,Dimensions,TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default class Card extends Component {
    render(){
        return(
            <TouchableOpacity style={styles.mainCard} onPress={()=>{
                this.props.nav.navigate("watch",{
                   link:this.props.link, 
                   num:this.props.num,
                   name:this.props.name,
                })
            }}>
                {/* <Ionicons name="play" size={15} color={"#fff"} style={{paddingLeft:4,}}/> */}
                <Text style={styles.text}>Ep : {this.props.num}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    mainCard: {
        flexDirection:'row',
        alignItems:'center',
        margin:10,
        width:width/4,
        backgroundColor:'#695088',
        borderRadius:5,
    },
    text:{
        color:'#fff',
        fontFamily:'Poppins',
        fontSize:15,
        padding:8,
    }
})
