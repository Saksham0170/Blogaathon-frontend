
// interface BlogContent {
//     id: string;
//     type: string;
//     props: {
//       textColor: string;
//       backgroundColor: string;
//       textAlignment: string;
//       level?: number;
//     };
//     content: {
//       type: string;
//       text: string;
//       styles: {
//         italic?: boolean;
//         bold?: boolean;
//         textColor?: string;
//       };
//     }[];
//     children: any[];
//   }
//   interface BlogScore {
//     [key: string]: number | string; // Allow both numbers and strings
    
//                 // Fixed string property
//   }
//   interface Blog {
//     blogId: number;
//     blog_author_name: string;
//     lastUpdates: string;
//     score?: BlogScore;
//     title: string;
//     content: BlogContent[];
//     markedAs: string;
//     isSubmitted: boolean;
//     status?: string;
//     feedback?: string | null;
//   }

//   interface Judge {
//     fullName: string;
//     email: string;
//     created_at: string;
//     phoneNumber: string;
//     currentRole: string;
//     organizationName: string;
//     industry: string;
//     city: string;
//     otherRole: string;
//     joinedOn: string;
//    assigndBlogs: Blog[];    
//   }


  
//   const PendingBlog:Blog={
//     blogId:1,
//     blog_author_name:'Test User2',
//     lastUpdates:'2024-01-01',
//     isSubmitted: true,
//     markedAs:'Submitted',
//     status:'pending',
//     title:'Introduction to z Hooks',
//     content: [
//       {
//         "id": "bb916674-a5d1-4fa1-9f3f-fdb91b89077e",
//         "type": "heading",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left",
//           "level": 1
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "dsdsd",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "4378380f-73f9-44c0-8421-92f607268bfa",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "potato",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "ad11acf2-de8f-403d-83b4-62cfd2a66136",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "right"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "tomato",
//             "styles": {
//               "italic": true
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "eab13729-b3b5-4205-820e-50b8d123b19f",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "onion",
//             "styles": {
//               "bold": true,
//               "textColor": "yellow"
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "3cb6faf3-31df-4a44-9bc7-d2c6329a8d08",
//         "type": "paragraph",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [],
//         "children": []
//       }
//     ],
//     feedback:null,
//     score:{'Content': 5, 'Style': 10, 'Structure': 7,  'feedback': ''},
    

//   };
//   const AcceptedBlog:Blog={
//     blogId:1,
//     blog_author_name:'Test User 1',
//     lastUpdates:'2024-01-01',
//     title:'Introduction to React Hooks',
//     content: [
//       {
//         "id": "bb916674-a5d1-4fa1-9f3f-fdb91b89077e",
//         "type": "heading",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left",
//           "level": 1
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "dsdsd",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "4378380f-73f9-44c0-8421-92f607268bfa",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "potato",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "ad11acf2-de8f-403d-83b4-62cfd2a66136",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "right"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "tomato",
//             "styles": {
//               "italic": true
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "eab13729-b3b5-4205-820e-50b8d123b19f",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "onion",
//             "styles": {
//               "bold": true,
//               "textColor": "yellow"
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "3cb6faf3-31df-4a44-9bc7-d2c6329a8d08",
//         "type": "paragraph",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [],
//         "children": []
//       }
//     ],
//     score:{ 'Content': 5, 'Style': 10, 'Structure': 7,'feedback': 'Accepted lorem ipsum'},
//     isSubmitted: true,
//     markedAs:'Submitted',
//     status:'accepted',
//     feedback:'lorem ipsum',



//   };
 
//   const RejectedBlog:Blog={
//     blogId:1,
//     blog_author_name:'Test User3',
   
//     lastUpdates:'2024-01-01',
//     title:'Introduction to Python Hooks',
//     content: [
//       {
//         "id": "bb916674-a5d1-4fa1-9f3f-fdb91b89077e",
//         "type": "heading",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left",
//           "level": 1
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "dsdsd",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "4378380f-73f9-44c0-8421-92f607268bfa",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "potato",
//             "styles": {}
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "ad11acf2-de8f-403d-83b4-62cfd2a66136",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "right"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "tomato",
//             "styles": {
//               "italic": true
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "eab13729-b3b5-4205-820e-50b8d123b19f",
//         "type": "numberedListItem",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [
//           {
//             "type": "text",
//             "text": "onion",
//             "styles": {
//               "bold": true,
//               "textColor": "yellow"
//             }
//           }
//         ],
//         "children": []
//       },
//       {
//         "id": "3cb6faf3-31df-4a44-9bc7-d2c6329a8d08",
//         "type": "paragraph",
//         "props": {
//           "textColor": "default",
//           "backgroundColor": "default",
//           "textAlignment": "left"
//         },
//         "content": [],
//         "children": []
//       }
//     ],
//     isSubmitted: true,
//     score:{ 'Content': 5, 'Style': 10, 'Structure': 7,'feedback': 'Rejected ?lorem ipsum'},
//     markedAs:'Submitted',
//     status:'rejected',
//     feedback:'lorem ipsum',



//   };

//   const judge1:Judge ={
//     fullName: 'Test User',
//     created_at: '2024-01-01',
//     email: 'test@example.com',
//     phoneNumber: '+91 XXXXXXXXXX',
//     industry: 'Civilian Government',
//     organizationName: 'Google',
//     currentRole: 'Student',
//     city: 'India',
//     otherRole: '',
//     joinedOn: '2024-01-01',
//     assigndBlogs:[PendingBlog,AcceptedBlog,RejectedBlog]
//   };


// export  {judge1};