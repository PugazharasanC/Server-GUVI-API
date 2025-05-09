import MockApi from "../models/MockApi.js";
import { v4 as uniqueId } from "uuid";

const MAX_ENDPOINT_PREFIX_LENGTH = 40;

function generateCleanEndpoint(input) {
  if (!input) return uniqueId();

  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanum with dashes
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .slice(0, MAX_ENDPOINT_PREFIX_LENGTH); // limit length

  return `${cleaned}-${uniqueId()}`;
}

function withApiUrl(mockApiDoc) {
  const obj = mockApiDoc.toObject();
  obj.apiURL = `${process.env.BACKEND_URL}/api/mock/data/${obj.endpoint}`;
  return obj;
}

// @desc    Create a new mock API endpoint
// @route   POST /api/mock
// @access  Private/Admin
export const createMockApi = async (req, res) => {
  try {
    const { name, description, endpoint, responseData } = req.body;

    const generatedEndPoint = generateCleanEndpoint(endpoint);

    // Check if endpoint already exists
    const existingEndpoint = await MockApi.findOne({
      endpoint: generatedEndPoint,
    });
    if (existingEndpoint) {
      return res.status(400).json({ message: "Endpoint already exists" });
    }

    // Create new mock API
    const mockApi = await MockApi.create({
      name,
      description,
      endpoint: generatedEndPoint,
      responseData,
      createdBy: req.user._id,
    });

    res.status(201).json(withApiUrl(mockApi));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mock APIs
// @route   GET /api/mock
// @access  Private
export const getMockApis = async (req, res) => {
  try {
    const mockApis = await MockApi.find({}).sort({ createdAt: -1 });
    res.json(mockApis.map(withApiUrl));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mock API by ID
// @route   GET /api/mock/:id
// @access  Public
export const getMockApiById = async (req, res) => {
  try {
    const mockApi = await MockApi.findById(req.params.id);

    if (mockApi) {
      res.json(withApiUrl(mockApi));
    } else {
      res.status(404).json({ message: "Mock API not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Access mock API data
// @route   GET /api/mock/data/:endpoint
// @access  Public
export const accessMockApiData = async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const mockApi = await MockApi.findOne({ endpoint });

    if (mockApi) {
      res.json(mockApi.responseData);
    } else {
      res.status(404).json({ message: "Mock API endpoint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mock API
// @route   PUT /api/mock/:id
// @access  Private/Admin
export const updateMockApi = async (req, res) => {
  try {
    const { name, description, endpoint, responseData } = req.body;
    const mockApi = await MockApi.findById(req.params.id);

    if (mockApi) {
      // Check if updating to an existing endpoint
      if (endpoint !== mockApi.endpoint) {
        const existingEndpoint = await MockApi.findOne({ endpoint });
        if (existingEndpoint) {
          return res.status(400).json({ message: "Endpoint already exists" });
        }
      }

      mockApi.name = name || mockApi.name;
      mockApi.description = description || mockApi.description;
      mockApi.endpoint = endpoint? generateCleanEndpoint(endpoint) : mockApi.endpoint;
      mockApi.responseData = responseData || mockApi.responseData;

      const updatedMockApi = await mockApi.save();
      res.json(withApiUrl(updatedMockApi));
    } else {
      res.status(404).json({ message: "Mock API not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete mock API
// @route   DELETE /api/mock/:id
// @access  Private/Admin
export const deleteMockApi = async (req, res) => {
  try {
    const mockApi = await MockApi.findById(req.params.id);

    if (mockApi) {
      await MockApi.deleteOne({ _id: mockApi._id });
      res.json({ message: "Mock API removed" });
    } else {
      res.status(404).json({ message: "Mock API not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
