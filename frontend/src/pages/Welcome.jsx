import { useEffect, useState } from "react";
import "./Welcome.css";

const QUOTES = [
  {
    text: "A reliable outbound pipeline is invisible when it works — and it should stay that way.",
    author: "SMTP Best Practices",
  },
  {
    text: "Deliverability isn't luck. It's authentication, reputation, and pacing done right.",
    author: "Email Infrastructure Notes",
  },
  {
    text: "Every email you send is a small promise that your systems are dependable.",
    author: "Professional Communication",
  },
  {
    text: "Good senders respect the inbox they're writing to as much as the message they're sending.",
    author: "Email Etiquette",
  },
];


const TIPS = [
  "Warm up new SMTP configurations gradually.",
  "Use App Passwords with providers supporting 2FA.",
  "Maintain delays between email sends.",
  "Monitor bounce and complaint rates.",
  "Use a recognizable From Name.",
];


export default function Welcome({ user }) {

  const [quoteIndex,setQuoteIndex]=useState(0);


  useEffect(()=>{

    const timer=setInterval(()=>{

      setQuoteIndex(
        i=>(i+1)%QUOTES.length
      );

    },6000);


    return ()=>clearInterval(timer);

  },[]);



  const quote=QUOTES[quoteIndex];



return (
  <div className="card border-0 shadow-sm h-100 dashboard-welcome">

    
    <div className="card-body p-4">


      {/* Header */}

      <div className="d-flex justify-content-between align-items-start mb-4">

        <div>

          <h4 className="fw-bold mb-15">

            Welcome back
            {user?.name ? `, ${user.name}` : ""} 👋

          </h4>


          <p className="text-muted mb-0 small">

            Your email infrastructure overview

          </p>

        </div>



        <span
          className="badge rounded-pill"
          
        >

          ● System Ready

        </span>


      </div>





      {/* Quote */}


      <div
        key={quoteIndex}
        className="quote-card quote-animation rounded-4 p-4 mb-4"
      >


        <div
          style={{
            fontSize:"30px",
            color:"#2563eb",
            lineHeight:1
          }}
        >
          "
        </div>



        <p className="mb-3">

          {quote.text}

        </p>



        <div
          className="text-end"
          style={{
            fontSize:"13px",
            fontWeight:600,
            color:"#2563eb"
          }}
        >

          — {quote.author}

        </div>


      </div>






      {/* Tips */}


      <h6 className="fw-bold mb-3">

        Email reliability tips

      </h6>




      <div className="d-flex flex-column gap-2">


        {TIPS.map((tip,index)=>(

          <div
            key={index}
            className="tip-item d-flex align-items-center gap-3"
          >


            <div className="tip-icon">

              ✓

            </div>



            <div
              style={{
                fontSize:"14px",
                color:"#374151"
              }}
            >

              {tip}

            </div>


          </div>

        ))}


      </div>


    </div>


  </div>
);
}