import React from 'react'

export const Footer = () => {
  return (
    <div className='main-footer' style={{
        textAlign:"center",
        fontWeight:"500",
    }}>
        <div className='container'>
        <hr/>
            <div className='row'>
                <p className='col-sm'>
                    &copy; {new Date().getFullYear()} VibeEzzy | Crafted With <i className='fa fa-heart' style={{fontSize:"18px",color:"red"}}/> By: @lokiinderr
                </p>
            </div>
        </div>
    </div>
  )
}
