const getCurrentUser = () => {
  try {
    const currentUserJSON = localStorage.getItem("currentUser");
    if (!currentUserJSON) {
      return null; // No user found in localStorage
    }
    const currentUser = JSON.parse(currentUserJSON);
    return currentUser.value; // Assuming currentUser is an object with a 'value' property
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null; // Return null or handle the error as per your application's logic
  }
};

export default getCurrentUser;