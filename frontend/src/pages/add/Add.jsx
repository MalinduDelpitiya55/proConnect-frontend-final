import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

// Function to get the token from cookies
const getTokenFromCookies = () => {
  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const Add = () => {
  // State to handle single file upload
  const [singleFile, setSingleFile] = useState(undefined);
  // State to handle multiple files upload
  const [files, setFiles] = useState([]);
  // State to handle uploading status
  const [uploading, setUploading] = useState(false);
  // Regex for validating inputs
  const validInputRegex = /^[a-zA-Z0-9 .']*/;
  // Reducer for managing gig state
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  // State for handling input errors
  const [errors, setErrors] = useState({});

  // Function to handle input changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    let error = "";

    // Validate input based on the field name
    if (name === "title" && value.length > 100) {
      error = "Title must be between 10 and 100 characters";
    } else if (name === "shortTitle" && value.length > 30) {
      error = "Service Title must be at most 30 characters";
    } else if (name === "deliveryTime" && (value < 1 || value > 20)) {
      error = "Delivery Time must be between 1 and 20 days";
    } else if (name === "revisionNumber" && (value < 0 || value > 15)) {
      error = "Revision Number must be between 0 and 15";
    } else if (name === "price" && value < 5) {
      error = "Price must be at least 5";
    }

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    // Check if the input value matches the allowed pattern and no error
    if (validInputRegex.test(value) && !error) {
      // Dispatch the change input action to the reducer
      dispatch({
        type: "CHANGE_INPUT",
        payload: {name, value},
      });
    }
  };

  // Function to handle adding a feature
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  // Function to handle file uploads
  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      // Check for maximum file upload limit
      if (files.length > 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          files: "You can upload a maximum of 5 images",
        }));
        setUploading(false);
        return;
      }

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({type: "ADD_IMAGES", payload: {cover, images}});
    } catch (err) {
      console.log(err);
    }
  };

  // Navigation hook for redirecting
  const navigate = useNavigate();

  // React Query client
  const queryClient = useQueryClient();

  // Mutation for creating a new gig
  const mutation = useMutation({
    mutationFn: (gig) => {
      // Add the Authorization header with the token
      const token = getTokenFromCookies();
      return newRequest.post("/gigs", gig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
    onError: () => {
      alert("Failed to create a new gig");
    },
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              value={state.title}
            />
            {errors.title && <p className="error">{errors.title}</p>}
            <label htmlFor="">Category</label>
            <select
              name="cat"
              id="cat"
              onChange={handleChange}
              value={state.cat}
            >
              <option value="Graphics Design">Graphics Design</option>
              <option value="Video Design">Video Design</option>
              <option value="Web Design">Web Design</option>
              <option value="Mobile Application Design">
                Mobile Application Design
              </option>
              <option value="Animation Design">Animation Design</option>
              <option value="AI Services">AI Services</option>
              <option value="Writing & Translation">
                Writing & Translation
              </option>
              <option value="music">Music & Audio</option>
              <option value="Programming & Tech">Programming & Tech</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading" : "Upload"}
              </button>
            </div>
            {errors.files && <p className="error">{errors.files}</p>}
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
              value={state.desc}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
              value={state.shortTitle}
            />
            {errors.shortTitle && <p className="error">{errors.shortTitle}</p>}
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              value={state.shortDesc}
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input
              type="number"
              name="deliveryTime"
              min={1}
              max={20}
              onChange={handleChange}
              value={state.deliveryTime}
            />
            {errors.deliveryTime && (
              <p className="error">{errors.deliveryTime}</p>
            )}
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              min={0}
              max={15}
              onChange={handleChange}
              value={state.revisionNumber}
            />
            {errors.revisionNumber && (
              <p className="error">{errors.revisionNumber}</p>
            )}
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input
                type="text"
                placeholder="e.g. page design"
                value={state.featureInput}
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch({
                    type: "UPDATE_FEATURE_INPUT",
                    payload: value,
                  });
                }}
              />
              <button type="submit">Add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({type: "REMOVE_FEATURE", payload: f})
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              type="number"
              min={5}
              onChange={handleChange}
              name="price"
              value={state.price}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
