import request, { gql } from 'graphql-request';
const MASTER_URL =
  'https://us-west-2.cdn.hygraph.com/content/' +
  process.env.NEXT_PUBLIC_HYGRAPH_KEY +
  '/master';

export const getCourseList = async () => {
  const query = gql`
    query courseList {
      courseLists {
        name
        banner {
          url
        }
        free
        id
        tags
        courseIntroYoutubeUrl
        totalChapters
        totalSections
        coursePoints
        createdBy {
          name
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const getCourseById = async (id, userEmail) => {
  const query =
    gql`
    query course {
      courseList(where: { id:  "` +
    id +
    `" }) {
        id
        name
        description
        coursePoints  
        sections {
          ... on Section {
            id
            name
            sectionNumber
            experience
            description
            chapters {
              ... on Chapter {
                id
                name
                chapterNumber
                description
                chapterPoints  
                quizzes {
                  ... on Quiz {
                    id
                    name
                    questions {
                      ... on Question {
                        id
                        name
                        correctOption
                        options
                        questionText
                      }
                    }
                  }
                }
                youtubeUrl
              }
            }
          }
        }
        tags
        totalChapters
        courseIntroYoutubeUrl
      }
      userEnrollCourses(where: { userEmail: "` +
    userEmail +
    `", courseId: "` +
    id +
    `" }) {
        userEmail
        courseId
        id
        completedChapterIds
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export const EnrollCourse = async (courseId, userEmail) => {
  const mutationQuery = gql`
mutation EnrollCourse {
  createUserEnrollCourse(
    data: {userEmail: "${userEmail}", courseId: "${courseId}", courseList: {connect: {id: "${courseId}"}}}
  ) {
    id
  }
}
  `;

  const result = await request(MASTER_URL, mutationQuery);
  return result;
};

export const PublishCourse = async (id) => {
  const mutationQuery =
    gql`
    mutation EnrollCourse {
      publishUserEnrollCourse(where: { id: "` +
    id +
    `" }) {
        id
      }
    }
  `;
  const result = await request(MASTER_URL, mutationQuery);
  return result;
};
export const MarkChapterCompleted = async ({
  userId,
  courseId,
  completedChapterIds,
}) => {
  const mutationQuery = gql`
    mutation MarkChapterComplete {
      updateUserEnrollCourse(
        where: { id: "${userId}" }
        data: { 
          completedChapterIds: "${completedChapterIds}", 
          courseId: "${courseId}" 
        }
      ) {
        id
      }
      publishManyUserEnrollCoursesConnection(to: PUBLISHED) {
        edges {
          node {
            id
          }
        }
      }
    }`;
  // Execute the mutation query
  try {
    const result = await request(MASTER_URL, mutationQuery);
    return result;
  } catch (error) {
    console.error('Error executing mutation:', error);
    throw error;
  }
};

// include completedChapterIds for progress tracking
export const GetUserCourseList = async (userEmail) => {
  const query = gql`
    query UserCourseList {
      userEnrollCourses(where: { userEmail: "${userEmail}" }) {
        completedChapterIds
        courseList {
          id
          name
          banner {
            url
          }
          createdBy {
            name
          }
          description
          free
          tags
          totalChapters
          totalSections
          coursePoints  
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};




export const getAgentByEmail = async (userEmail) => {
  const query = gql`
    query getAgentByEmail {
      agent(where: { userEmail: "${userEmail}" }) {
        firstName
        lastName
        userEmail
        cumulativePoints
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};


// Mutation to update the cumulative points
export const updateAgentPoints = async (userEmail, points) => {
  const mutationQuery = gql`
    mutation UpdateAgentPoints {
      updateAgent(
        where: { userEmail: "${userEmail}" }
        data: { cumulativePoints: ${points} }
      ) {
        id
        cumulativePoints
      }
    }
  `;

  // Mutation to publish the updated data
  const publishMutation = gql`
    mutation PublishAgent {
      publishAgent(where: { userEmail: "${userEmail}" }) {
        id
      }
    }
  `;
  // Execute
  await request(MASTER_URL, mutationQuery); 
  await request(MASTER_URL, publishMutation); 
};


// Query to fetch the list of rewards
export const getRewardsList = async () => {
  const query = gql`
    query getRewards {
      rewards {
        id
        name
        description
        price
        rewardTier
        image {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result.rewards;
};


// Create and publish a purchased reward entry
export const recordPurchasedReward = async (userEmail, rewardId, quantity) => {

  // Mutation to create the purchased reward; default status is set to "Not Started"
  const createPurchasedRewardQuery = gql`
    mutation CreatePurchasedReward {
      createPurchasedReward(
        data: {
          email: "${userEmail}", 
          reward: { connect: { id: "${rewardId}" } }, 
          rewardStatus: notStarted
          quantity: ${quantity} 
        }
      ) {
        id
        quantity
      }
    }
  `;

  console.log("Email in recordPurchasedReward:", userEmail); // Log the email being passed
  console.log("Reward ID in recordPurchasedReward:", rewardId); // Log the reward ID
  console.log("Quantity in recordPurchasedReward:", quantity); // Log the quantity

  // Mutation to publish the purchased reward
  const publishPurchasedRewardQuery = gql`
    mutation PublishPurchasedReward($id: ID!) {
      publishPurchasedReward(where: { id: $id }) {
        id
      }
    }
  `;
  // Execute the mutations
  try {

    const result = await request(MASTER_URL, createPurchasedRewardQuery);
    const purchasedRewardId = result.createPurchasedReward.id;

    await request(MASTER_URL, publishPurchasedRewardQuery, { id: purchasedRewardId });

    console.log('Purchased reward recorded successfully.');
  } catch (error) {
    console.error('Error recording purchased reward:', error);
    throw error;
  }
};



export const getPurchasedRewardsList = async (userEmail, skip = 0) => {
  const query = gql`
    query GetPurchasedRewards {
      purchasedRewards(where: { email: "${userEmail}" }, first: 100, skip: ${skip}) { 
        id 
        rewardStatus
        createdAt
        quantity
        reward { 
          id 
          name 
          description 
          price 
          rewardTier 
          image { 
            url 
          }
        }
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result.purchasedRewards;
  } catch (error) {
    console.error('Error fetching purchased rewards:', error);
    return [];
  }
};

