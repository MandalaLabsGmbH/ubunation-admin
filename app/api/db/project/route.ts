import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

// Helper function to fetch a single project
const fetchProjectById = (id: number) => {
    return axios.get(`${API_BASE_URL}/Project/getProjectByProjectId`, {
        params: { projectId: id },
    });
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        // Case 1: Fetch a single project by its ID if provided in the URL
        if (projectId) {
            const response = await fetchProjectById(Number(projectId));
            return NextResponse.json(response.data);
        }

        // Case 2: (Temporary Demo Logic) If no ID is provided, fetch projects 1, 2, and 3
        const projectIds = [1, 2, 3];
        // Use Promise.allSettled to ensure all requests complete, even if one fails
        const projectPromises = await Promise.allSettled(
            projectIds.map(id => fetchProjectById(id))
        );

        const successfulProjects = projectPromises
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value.data);
        
        // Log if any of the project fetches failed
        projectPromises.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to fetch project with ID ${projectIds[index]}:`, result.reason);
            }
        });

        return NextResponse.json(successfulProjects);

    } catch (e) {
        console.error({ e });

        if (axios.isAxiosError(e)) {
            const err = e as AxiosError;
            return NextResponse.json(
                { message: err.message, details: err.response?.data },
                { status: err.response?.status || 500, statusText: "API call failed" }
            );
        }

        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}