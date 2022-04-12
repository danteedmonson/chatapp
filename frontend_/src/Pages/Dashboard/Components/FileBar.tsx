import { IconButton, Button } from '@material-ui/core';
import { ArrowLeft, ArrowRight, Add } from '@mui/icons-material';
import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

interface fileProps {
  media:
  { _id: string, file: string, type: string }[]
}


export default function FileBar(props: fileProps) {
  const [message, setMessage] = useState();
  const [currentImage, setCurrentImage] = useState(0)
  const [showImage, setShowImage] = useState(false)

  

   function changeslide(direction:string) {
     if(direction === "left") {
       setCurrentImage((prev)=>{
         if(prev-1 < 0) {
           return props.media.length + prev-1
         }
         return((prev-1))
        })
       console.log(currentImage)
    }
    else {
      setCurrentImage((prev)=>{
        if(prev+1 > props.media.length-1) {
          return prev+1 - props.media.length
        }
        return((prev+1))
       })
       console.log(currentImage)
    }
  }

  function imagePrev (current:number) {
    setShowImage(true)
    setCurrentImage(current)
  }
   
  function goToImage(mesID:string) {
    setShowImage(false)
    document.getElementById(mesID)?.scrollIntoView({behavior: "smooth"})
  }




  return (
    <>
    <div id="filebar">
      <div style={{ overflow: "auto", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", width: "92%", justifyContent: "space-between", alignItems: "center" }}>
          <h3>MEDIA</h3>

          {/* <input id="find-user" style={{display: !searchMode ? "none" : "inline"}}></input> */}
        </div>
        <div style={{ overflow: "auto", width: "100%", height: 450, maxHeight: 450, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "75%", height: "40%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Button
              style={
                {
                  backgroundColor: "#181c2c",
                  width: "calc(50% - 2px)",
                  height: "calc(100% - 2px)",
                  borderTopLeftRadius: 15,
                  backgroundImage: `url(${props?.media[props.media.length - 1]?.file})`,
                  backgroundSize: "cover",
                  display: props.media.length > 0 ? "block" : "none"
                }
              }
              onClick={()=>imagePrev(props.media.length - 1)}

              >
              <div style={{ width: "100%", height: "100%" }}></div>

            </Button>
            <Button
              style={
                {
                  backgroundColor: "#181c2c",
                  width: "calc(50% - 2px)",
                  height: "calc(100% - 2px)",
                  borderTopRightRadius: 15,
                  backgroundImage: `url(${props?.media[props.media.length - 2]?.file})`,
                  backgroundSize: "cover",
                  display: props.media.length > 1 ? "block" : "none",
                }
              }
              onClick={()=>imagePrev(props.media.length - 2)}
              >
              <div style={{ width: "100%", height: "100%" }}></div>
            </Button>
          </div>
          <div style={{ width: "75%", height: "40%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Button
              style={
                {
                  backgroundColor: "#181c2c",
                  width: "calc(50% - 2px)",
                  height: "calc(100% - 2px)",
                  borderBottomLeftRadius: 15,
                  backgroundImage: `url(${props?.media[props.media.length - 3]?.file})`,
                  backgroundSize: "cover",
                  display: props.media.length > 2 ? "block" : "none"
                }
              }
              onClick={()=>imagePrev(props.media.length - 3)}

              >

              <div style={{ width: "100%", height: "100%" }}></div>

            </Button>
            <Button
              style={
                {
                  backgroundColor: "#181c2c",
                  width: "calc(50% - 2px)",
                  height: "calc(100% - 2px)",
                  borderBottomRightRadius: 15,
                  backgroundImage: `url(${props?.media[props.media.length - 4]?.file})`,
                  backgroundSize: "cover",
                  color: "white",
                  fontSize: 24,
                  overflow: "hidden",
                  display: props.media.length > 3 ? "flex" : "none"

                }
              }
              onClick={()=>imagePrev(props.media.length - 4)}

              >

              {
                props.media.length > 4 &&
                <div style={
                  {
                    minWidth: "100%",
                    minHeight: "100%",
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.500)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>+{props.media.length - 3}
                </div>
              }

            </Button>
          </div>
        </div>
      </div>
      </div>

      {
        showImage &&
        <div style={{
          position:"fixed",
          left:0, right:0, bottom:0, top:0,
          height:"100vh",
          width:"100vw", 
          backgroundColor:"rgba(110, 51, 47, 0.8)", 
          zIndex:10,
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
          }}
          >
            <IconButton onClick={()=>setShowImage(false)} style={{position:"absolute", right:0, top:0}}>  
              <Add  style={{fontSize:30, color:"white", zIndex:1000, transform:"rotate(45deg)" }}/> 
            </IconButton>



            <IconButton onClick={()=>changeslide("left")}>  <ArrowLeft  style={{fontSize:50, color:"white", zIndex:1000,}}/> </IconButton>

            {
              props?.media[currentImage]?.type == "img" ?
              <img onClick={()=>goToImage(props?.media[currentImage]?._id)} src={props?.media[currentImage]?.file} style={{maxHeight:"80vh", width:"auto", borderRadius:15, cursor:"pointer"}}></img>
              :
            <video style={{maxHeight:"80vh", width:"auto", borderRadius:15}} controls><source src={props?.media[currentImage]?.file}></source></video>
            }
            <IconButton onClick={()=>changeslide("right")}> <ArrowRight style={{fontSize:50, color:"white",zIndex:1000}}/> </IconButton>
      
       
      
      </div>
      }
    </>
  );
}
//src={media[media.length-1].file