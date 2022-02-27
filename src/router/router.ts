import {createRouter, createWebHistory} from "vue-router";
import RepositoriesPage from "@/views/Repositories/RepositoriesPage.vue";
import ExplorePage from "@/views/Explore/ExplorePage.vue";
import UpdateRepositoryPage from "@/views/Update/UpdateRepositoryPage.vue";
import SystemPage from "@/views/System/SystemPage.vue";
import HomePage from "@/views/HomePage.vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import QueryPage from "@/views/Explore/QueryPage.vue";
import Types from "@/views/Explore/AbouRepository/Types.vue";
import Context from "@/views/Explore/AbouRepository/Context.vue";
import Namespaces from "@/views/Explore/AbouRepository/Namespaces.vue";

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
        path: '/types',
        name: 'Types',
        component: Types
    },
    {
        path: '/context',
        name: 'Context',
        component: Context
    },
    {
        path: '/namespaces',
        name: 'Namespaces',
        component: Namespaces
    },
    {
        path: '/query',
        name: 'QueryPage',
        component: QueryPage
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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router