import {createRouter, createWebHistory} from "vue-router";
import RepositoriesPage from "@/views/Repositories/RepositoriesPage.vue";
import ExplorePage from "@/views/Explore/ExplorePage.vue";
import UpdateRepositoryPage from "@/views/Update/UpdateRepositoryPage.vue";
import SystemPage from "@/views/System/SystemPage.vue";
import HomePage from "@/views/HomePage.vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import QueryPage from "@/views/Explore/QueryPage.vue";
import QueryResultPage from "@/views/Explore/QueryResultPage.vue";
import PageNotFound from "@/views/PageNotFound.vue";

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/repositories/:name?',
        name: 'RepositoriesPage',
        component: RepositoriesPage,
        props: true,
    },
    {
        path: '/repositories/:name/explore',
        name: 'ExplorePage',
        component: ExplorePage,
        props: true
    },
    {
        path: '/repositories/:name/about',
        name: 'AboutRepositoryPage',
        component: AboutRepositoryPage,
        props: true,

    },
    {
        path: '/repositories/:name/query',
        name: 'QueryPage',
        component: QueryPage,
    },
    {
        path: '/repositories/:name/queryResult',
        name: 'QueryResultPage',
        component: QueryResultPage,
        props: true,
    },
    {
        path: '/update',
        name: 'UpdateRepositoryPage',
        component: UpdateRepositoryPage
    },
    {
        path: '/system',
        name: 'SystemPage',
        component: SystemPage
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: PageNotFound,
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router