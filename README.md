I created this listening module because I was struggling to get unsolicited RS-232 data from an Extron SW4 USB Plus.

I use the Extron USB switcher as part of an Audiovisual setup to give keyboard and mouse control to presenters speaking at conferences.  We run their presentations from computers at a tech table and provide mouse & keyboard control via USB extenders.  Since we use multiple computers, the USB switcher is needed.

My full setup (prior to this module) can be found and replicated by viewing this video: 

https://youtu.be/SfWYuvsENCw

I'm all about efficiency and wanted to be able to push one button on a StreamDeck to have the video source change and the keyboard and mouse signal also rerouted at once.  Prior to this, I had to change the video signal, then remember to reach and push a button on the Extron.

The RS-232 Serial communication is done through the Generic: TCP Serial Port, along with Generic: TCP and UDP Requests (explained in YouTube video above).  I use port 32101 for this serial connection, which is why this module is programmed to listen to that port.  The issue with Generic TCP & UDP Requests module is that it only saves the "Last TCP Response," which with RS-232 is often simply 0a (the final code of the hexadecimal serial data coming from the Extron).  I needed something to listen to the entire sequence coming through to be able to program feedback on my Streamdeck.  I can now physically push the button on the Extron if needed, and buttons on the Streamdeck show which Extron source is active.

After installing this module, make sure the Serial IP Address is what your setup requires.  127.0.0.1 is the local host, which should work for most.  The Generic TCP Serial Port defaults to 32101.  Change if your setup uses a different port.

You should then be able to see SW4_Listener show up under your "variables."  I copied the variable for "selected input" which is called $(SW4_Listener:selected_input) and used that to manipulate feedbacks on buttons.  I added feedback of "internal: Variable: Check value" then checked the variable of SW4_Listener:selected_input and put "1" for Extron 1, "2" for Extron 2, etc.  I then have the style override change the text color to green when each source is active.

I created this when using Companion version 5.1.1
