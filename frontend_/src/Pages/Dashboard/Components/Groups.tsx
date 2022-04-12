import React, { useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Add } from '@mui/icons-material';

export default function Groups(props: any) {
    const [message, setMessage] = useState('');


    return (



        <div id="group-section">
            <div style={{ display: "flex", width: "100%", height:"100%", justifyContent: "space-between", alignItems:"center", flexDirection: "column" }}>
                <div style={{ display: "flex", width: "92%", justifyContent: "space-between" }}>
                    <h3 style={{ display: "inline" }}>GROUPS</h3>
                    <IconButton id="add-button"><Add /></IconButton>                
                </div>
                <div style={{ overflow: "auto", width: "100%", maxHeight: 250, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                    {
                        ["Binary Boys", "FourScript", "QrDocent", "Hackathon", "UCF"].map((element) =>
                        <Button id='searched-contacts' onClick={() => console.log(element)}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: 30,
                            marginRight: "5%",
                            backgroundSize: "cover"
                          }}>#</div>
          
                        {element}
                      </Button>
                        )
                    }

                </div>
            </div>
        </div>

    );
}
