import { ref, computed, type Ref } from "vue";
import { getCookieValue, DIRECTUS_URL, mapToValidUser, base64Url } from '@/utils/helpers';
import { createDirectus, rest, readMe, staticToken, authentication, updateItem, createItem, updateMe, readItems, auth, withToken } from '@directus/sdk';

import type { Attendee, RSVPMetaData, RSVPResponse, SiteToast, User } from "@/utils/types";
import type { DirectusAstroUser } from '@/utils/types';
import type { AuthenticationData, DirectusClient, AuthenticationClient, RestClient, DirectusUser } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = DIRECTUS_URL()

let isAuth = ref(false);
let user = ref<User | null>(null);
let rawUser = ref<DirectusAstroUser | null>(null);
let responseFromServer = ref<any>(null);
let isLoading = ref(false);
let meetupAttendees: Ref<Record<string, Attendee[]>> = ref({});

let toastMessage = ref<SiteToast>({
    title: undefined,
    message: undefined,
    type: undefined,
    visible: false,
})

export function getClient() {
    return createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
}

export function useToast() {
    function show(message: SiteToast) {
        toastMessage.value = message
    }

    function hide() {
        toastMessage.value.visible = false
    }

    const isVisible = computed(() => {
        return toastMessage.value.visible
    })

    return {
        toastMessage,
        isVisible,
        show,
        hide
    }
}

export default function useAuth() {

    async function readRsvp({ id, event_id, user_id }: { id?: string, event_id?: string, user_id?: string }) {
        try {
            isLoading.value = true;
            const token = 'RT8imy3iJljgbpNV2FoZzy4E1luRuugo' // getCookieValue('access_token')

            if (!token) {
                isLoading.value = false;
                throw new Error('User is not logged in')
            }

            const client = createDirectus(DIRECTUS_PROJECT_URL).with(rest());


            const query_object = {
                filter: {
                    // ID: {
                    //     _eq: id
                    // },    
                    Events_id: {
                        _eq: event_id
                    },
                    directus_users_id: {
                        _eq: user_id
                    }
                },
                fields: [
                    "profile_picture",
                    "name",
                    "is_public"
                ]
            }

            const primaryKeyQuest = await client.request(
                withToken(token, readItems('Events_directus_users', query_object))
            );

            isLoading.value = false;
            return primaryKeyQuest

        } catch (error) {
            console.log(error)
        }
    }

    return {

        readRsvp,

    }
}
