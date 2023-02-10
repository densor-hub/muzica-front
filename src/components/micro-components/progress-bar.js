import './progress-bar.css';

const ProgressBar=({currentContent, content, bools})=>{
    const themeColrs ={validated : "rgb(255, 71, 86)", notValidated : 'white'}

    return(
        <>
                <section className="progress-bar">
                   <div className="ball" style={((currentContent === content.audio)  || currentContent === "")  ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}: {}}>
                        {currentContent === content.audio || currentContent === "" ? <div className="number">1</div>:
                        <div className="validated">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        }
                   </div>

                   <div className="bar" style={currentContent === content.audio  || currentContent === "" ? { backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball" style={((currentContent===content.audio)|| (currentContent===content.video) || currentContent === "" ) ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                       {((currentContent===content.audio)|| (currentContent===content.video) || currentContent === "" ) ? <div className="number">2</div>:
                        <div className="validated">
                             <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        }
                   </div>

                   <div className="bar" style={((currentContent===content.audio)|| (currentContent===content.video) || currentContent === "" ) ? { backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball" style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images)|| currentContent === "" ) ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                        { ((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || currentContent === "" ) ? <div className="number">3</div>:
                            <div className="validated">
                            <div className="front"></div>
                                <div className="back"></div>
                            </div>
                        }
                   </div>

                   <div className="bar"  style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || currentContent === "" )? { backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball" style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || currentContent === "" ) ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                       { ((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || currentContent === "" ) ?  <div className="number">4</div>:
                            <div className="validated">
                            <div className="front"></div>
                                <div className="back"></div>
                            </div>
                        }
                   </div>

                   <div className="bar"  style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || currentContent === "" )? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball"  style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news) || currentContent === "") ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                        {((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news) || currentContent === "" ) ? <div className="number">5</div>:
                            <div className="validated">
                            <div className="front"></div>
                                <div className="back"></div>
                            </div>
                        }
                   </div>

                   <div className="bar"  style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news) || currentContent === "" ) ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball" style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news || (currentContent === content.biography && !bools.showAdded)) || currentContent === "")? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                       { ((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news || (currentContent === content.biography && !bools.showAdded)) || currentContent === "" ) ? <div className="number">6</div> : 
                            <div className="validated">
                            <div className="front"></div>
                                <div className="back"></div>
                            </div>
                        }
                   </div>

                    <div className="bar" style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news || (currentContent === content.biography && !bools.showAdded)) || currentContent === "" )? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}></div>

                   <div className="ball" style={((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news || (currentContent === content.biography) || (currentContent === content.socials))|| currentContent === "" ) ? {fontWeight:"bold", backgroundColor : themeColrs?.notValidated, color: themeColrs?.validated}:{}}>
                     
                       { (((currentContent===content.audio)|| (currentContent===content.video) || (currentContent===content.images) || (currentContent===content.upcoming) || (currentContent===content.news || (currentContent === content.biography) || (currentContent === content.socials ) || currentContent === "" )) && currentContent !== content.createsite) ? <div className="number">7</div> : 
                            <div className="validated">
                            <div className="front"></div>
                                <div className="back"></div>
                            </div>
                        }
                   </div>
                    
               </section>

        </>
    )
}

export default ProgressBar;