import axios from "axios";
import { useState, useRef, useMemo, useEffect } from "react";
import { API_BASE_URL } from "../../../Resources/BaseURL";
import setStatuscodeErrorMessage from "../../../FNS/setStatuscodeErrorMessage";
import GotoRefreshEndPoint from "../../../FNS/GoToRefreshEndPoint";
import useAuth from "../../../customHooks/useAuth";
import Loading from "../../micro-components/loading";
import { useNavigate } from "react-router-dom";
import { equal_To_Or_Bigger_Than_Toadys_Date, isValidDate } from "../../../FNS/DurationValidator";

import '../../micro-components/add-upcoming.css';
import '../CSS/added.css'

const AddNewUpcoming = () => {

    const { auth } = useAuth();
    const navigateTo = useNavigate();
    const [dropdownIterator, setDropDownIterator] = useState(-1);
    const [upcomingDetails, setUpcomingDetails] = useState({})
    const upcoming = useMemo(() => { return ['New release', 'Tour', 'Event'] }, []);
    const themeColor = { valid: "white", error: "rgb(255, 71, 86)" }
    const [selectedToEdit, setSelectedToEdit] = useState('');
    const typeTDref = useRef();
    const [feedback, setFeedback] = useState('');
    const [bools, setBools] = useState({ showloading: false })

    const upcomingRefs = useRef([]);
    const addToUpcomingRefs = (element) => {
        if (element && !upcomingRefs.current.includes(element)) {
            upcomingRefs.current.push(element)
        }
        else {
            upcomingRefs.current.pop(element);
        }
    }


    const saveUpcoming = async () => {

        setUpcomingDetails((p) => { return { ...p, type: upcomingRefs?.current[0]?.value, date: upcomingRefs?.current[1]?.value, specifics: upcomingRefs?.current[2]?.value, description: upcomingRefs?.current[3]?.value } });

        const upcomingObject = { type: upcomingRefs?.current[0]?.value, date: upcomingRefs?.current[1]?.value, specifics: upcomingRefs?.current[2]?.value, description: upcomingRefs?.current[3]?.value, not_current_content: true }

        let typeconfirmed = false;
        let requiredButEmptyFields = false;
        let validDate = false;
        if (selectedToEdit === "") {
            upcomingRefs.current?.forEach(element => {
                if (element?.value === "") {
                    element.style.borderBottom = `3px solid ${themeColor.error}`;
                    setFeedback('Enter all fields')
                    requiredButEmptyFields = true;
                }
                else {
                    element.style.borderBottom = `3px solid ${themeColor.valid}`;
                    if (element?.className === 'typeInput') {
                        if (upcoming.includes(element?.value[0].toUpperCase() + element?.value?.slice(1, element?.value?.length).toLowerCase())) {
                            typeconfirmed = true;
                        }
                    }

                    if (element?.type === 'date' || element?.className === "date" || element?.id === "date") {
                        if (equal_To_Or_Bigger_Than_Toadys_Date(String(element?.value))) {
                            validDate = true;
                            console.log('hererere')
                        }
                        else {
                            setFeedback('Date must not be in the past');
                            element.style.borderBottom = `3px solid ${themeColor?.error}`
                        }

                        if (!isValidDate(element.value)) {
                            setFeedback('Invalid date');
                            element.style.borderBottom = `3px solid ${themeColor?.error}`
                        }

                    }
                }
            })

            if (!requiredButEmptyFields && typeconfirmed && validDate) {

                setBools(p => { return { ...p, showloading: true } });
                try {
                    let response = await axios.post(`${API_BASE_URL}/save-upcoming`, upcomingObject, { withCredentials: true })

                    if (response.status === 200) {
                        // setBools(p=>{return{...p, showloading : false }});
                        // setDefaultValuesToBlank();
                        // setAddedUpcoming({})
                        // setFeedback("Saved successfully, redirecting..."); 

                        //setTimeout(()=>{
                        navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-upcoming`)
                        // },2000)
                    }
                } catch (error) {
                    if (!error?.response?.data) {
                        setBools(p => { return { ...p, showloading: false } });
                        setFeedback('Network error...')
                    }
                    else {
                        if (error?.response?.status === 401) {
                            GotoRefreshEndPoint(auth).then((r) => {
                                if (r.status === 200) {

                                    saveUpcoming();
                                } else {
                                    navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`)
                                }
                            })
                        }
                        else {
                            setStatuscodeErrorMessage(error?.response?.status, setFeedback)
                            setBools(p => { return { ...p, showloading: false } });
                        }
                    }
                }
            }
        }
    }

    // const setDefaultValuesToBlank =()=>{
    //     upcomingRefs.current.forEach((element)=>{
    //         element.value ="";
    //         element.style.borderBottom = `3px solid ${themeColor?.valid}`
    //     })
    //     setDropDownIterator(-1);
    //     setFeedback("");
    // }

    //toggle on and off dropdown MENU
    useEffect(() => {
        const Clicked = (e) => {
            if (typeTDref.current && !typeTDref.current.contains(e.target)) {
                setBools((p) => { return { ...p, showDropdown: false } });
                setDropDownIterator(-1)
            }
        }

        document.addEventListener('click', Clicked);

        return () => {
            document.removeEventListener('click', Clicked);
        }

    }, [typeTDref, bools, setBools])


    // navigating dropdownMenu with keyboard ArrowKeys

    useEffect(() => {
        const navigateDropdownList = (e) => {
            if (typeTDref?.current) {
                //move up
                if (e.key === "ArrowUp") {
                    if (dropdownIterator === -1) {
                        typeTDref.current?.childNodes[0]?.lastChild?.firstChild?.focus();
                        setDropDownIterator(typeTDref.current?.childNodes[0]?.childNodes?.length - 1)
                    }
                    else {
                        console.log(dropdownIterator)
                        setDropDownIterator(p => { return p - 1 })
                        dropdownIterator === 0 && setDropDownIterator(typeTDref.current?.childNodes[0]?.childNodes?.length - 1);
                    }
                    typeTDref.current?.childNodes[0]?.childNodes[dropdownIterator]?.firstChild?.focus();

                }

                //move down
                if (e.key === "ArrowDown") {
                    if (dropdownIterator === -1) {
                        setDropDownIterator(1)
                        typeTDref.current?.childNodes[0]?.childNodes[0]?.firstChild?.focus();
                    }
                    else {
                        setDropDownIterator(P => { return P + 1 });
                        dropdownIterator === typeTDref.current?.childNodes[0]?.childNodes?.length - 1 && setDropDownIterator(0);
                    }

                    typeTDref.current?.childNodes[0]?.childNodes[dropdownIterator]?.firstChild?.focus();
                }
            }

        }
        document.addEventListener('keydown', navigateDropdownList);
        return () => {
            document.removeEventListener('keydown', navigateDropdownList);
        }
    }, [dropdownIterator, typeTDref]);


    return (<>
        {bools.showloading && <Loading />}
        {<main>
            <div className="feedback-container" style={!feedback ? { backgroundColor: "transparent" } : {}}>
                <div className="feeback"> <span style={{ visibility: "hidden" }}>.</span>{feedback}</div>
            </div>
            <div className="page-heading" >ADDED NEW <i><b>UPCOMING</b></i></div>



            <section className="add-upcoming">

                <form className="form1">
                    <table>
                        <tbody>
                            <tr>
                                <td className="label"><label>Type</label><span>*</span></td>
                                <td>
                                    <input className="typeInput" type={'text'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.type} placeholder="Select type" onClick={() => { setBools(p => { return { ...p, showDropdown: true } }) }} onChange={() => { setBools(p => { return { ...p, showDropdown: true } }) }}></input>
                                </td>

                            </tr>
                            {bools?.showDropdown && <tr>
                                <td></td>
                                <td ref={typeTDref}><div className={'type'} ref={typeTDref}>{upcoming.map((type, index) => {
                                    return (
                                        <div key={index} className={'individualType'}>
                                            <button onClick={(e) => { e.preventDefault(); upcomingRefs.current[0].value = type; setBools(p => { return { ...p, showDropdown: false } }); selectedToEdit && setSelectedToEdit(p => { return { ...p, type } }) }}>{type}</button>
                                        </div>
                                    )
                                })}</div>
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </form>
                <form className="form2">
                    <table>
                        <tbody>
                            <tr>
                                <td className="label"> <label>Date</label><span>*</span></td>
                                <td><input type={'date'} className={'date'} id={'date'} placeholder={'YYYY-MM-DD'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.date}></input></td>
                            </tr>

                            {((upcomingRefs?.current[0]?.value === upcoming[0]) || selectedToEdit.type === upcoming[0]) && <tr>
                                <td className="label"><label>Title</label> <span>*</span></td>
                                <td><input type={'text'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.title} placeholder="Title"></input></td>
                            </tr>}

                            {((upcomingRefs?.current[0]?.value === upcoming[1]) || selectedToEdit.type === upcoming[1]) && <tr>
                                <td className="label"><label>Location</label> <span>*</span></td>
                                <td><input type={'text'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.location} placeholder="Location"></input></td>
                            </tr>}

                            {((upcomingRefs?.current[0]?.value === upcoming[2]) || selectedToEdit.type === upcoming[2]) && <tr>
                                <td className="label"><label>Venue</label> <span>*</span></td>
                                <td><input type={'text'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.venue} placeholder="Venue"></input></td>
                            </tr>}
                            <tr>
                                <td className="label"><label>Description</label><span className="notForTooSmall">*</span></td>
                                <td><textarea type={'text'} ref={addToUpcomingRefs} defaultValue={upcomingDetails?.description} placeholder="Description"></textarea></td>
                            </tr>

                            <tr style={{ textAlign: "center" }}>
                                <td><button onClick={(e) => { e.preventDefault(); saveUpcoming() }}>Save</button></td>
                                <td><button onClick={(e) => { e.preventDefault(); navigateTo(`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-upcoming`) }}>Cancel</button></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </section>
        </main>
        }

    </>)
}

export default AddNewUpcoming;