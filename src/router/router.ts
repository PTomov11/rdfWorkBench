import {createRouter, createWebHistory} from "vue-router";
import RepositoriesPage from "@/views/Repositories/RepositoriesPage.vue";
import ExplorePage from "@/views/Explore/ExplorePage.vue";
import UpdatePage from "@/views/Update/UpdatePage.vue";
import SystemPage from "@/views/System/SystemPage.vue";
import HomePage from "@/views/HomePage.vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import QueryPage from "@/views/Explore/QueryPage.vue";

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/repositories',
        name: 'RepositoriesPage',
        component: RepositoriesPage
    },
    {
        path: '/explore',
        name: 'ExplorePage',
        component: ExplorePage
    },
    {
        path: '/about',
        name: 'AboutRepositoryPage',
        component: AboutRepositoryPage
    },
    {
        path: '/query',
        name: 'QueryPage',
        component: QueryPage
    },
    {
        path: '/update',
        name: 'UpdatePage',
        component: UpdatePage
    },
    {
        path: '/system',
        name: 'SystemPage',
        component: SystemPage
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router