import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import GithubFeed from '@/components/GithubFeed';

export default function PostsScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const navigation = useNavigation();

    // Parse the slug format: username@repo-name
    const [owner, repo] = (slug || '').split('@');

    useEffect(() => {
        // Update the header title to show the repository name
        navigation.setOptions({
            title: repo ? `${owner}/${repo}` : 'Updates',
            headerTitle: repo ? `${owner}/${repo}` : 'Updates'
        });
    }, [owner, repo, navigation]);

    return (
        <GithubFeed owner={owner} repo={repo} />
    );
}
