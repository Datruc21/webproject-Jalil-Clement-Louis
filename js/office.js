/*Things to do 
find current date
compute Monday and saturday (their number in month)
display all from the data at their right place*/

const printOfficeHours = () => {
    const today = new Date();
    const dayNumber = today.getDate();
    const month = today.getMonth() + 1;
    const day = today.getDay();//0 for sunday, 1 for monday...

    const saturday = dayNumber;
    const monday = dayNumber;
    
    
}
