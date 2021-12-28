import React, { useEffect, setState, useState } from "react";


function PDFVIEWER(props) {

    const [pdfUrl, setPdfUrl] =useState(null)


useEffect(()=>{
    fetch("/resume",{
        method: 'GET',
        responseType: 'blob'
    })
    .then(res => res.blob())
    .then(res => {
        const file = new Blob(
        [res], 
        {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        setPdfUrl(fileURL)
        })

    .catch(err=>{
        console.log(err);
    })

},[])
    if(pdfUrl===null){
        return(
            <div>
                <h1>NOTHING Loading</h1>
            </div>
        )
    }else{
        return (
            <div>
              <iframe
                title="PDF"
                src={pdfUrl}
                width="375px"
                height="812px"
              ></iframe>
            </div>
          )
    }
   
  }
  
  export default PDFVIEWER;