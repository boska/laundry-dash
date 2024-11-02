import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/ctx/ThemeContext';
import { NoData } from '@/components/NoData';

interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author: {
        avatar_url: string;
        login: string;
    };
}

function getRelativeTime(date: string) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

export default function NewsScreen() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { theme } = useTheme();

    const fetchCommitMessages = async () => {
        const url = 'https://api.github.com/repos/boska/laundry-dash/commits';

        try {
            const response = await fetch(url, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            if (!response.ok) {
                throw new Error(`GitHub API request failed: ${response.status}`);
            }

            const data = await response.json();
            setCommits(data);
        } catch (error) {
            console.error("Error fetching commit messages:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCommitMessages();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchCommitMessages();
    };

    if (isLoading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors[theme ?? 'light'].tint} />
            </ThemedView>
        );
    }

    if (!commits.length) {
        return (
            <NoData
                colorScheme={theme}
                icon="git-commit-outline"
                title="No commits found"
                subtitle="Pull down to refresh and check for new commits"
            />
        );
    }

    const renderCommitItem = ({ item }: { item: Commit }) => {
        const relativeTime = getRelativeTime(item.commit.author.date);
        const markdownStyles = {
            body: {
                color: Colors[theme ?? 'light'].text,
                fontSize: 16,
                lineHeight: 22,
                fontWeight: '500',
            },
            link: {
                color: Colors[theme ?? 'light'].tint,
            },
            code_inline: {
                backgroundColor: Colors[theme ?? 'light'].inputBackground,
                padding: 4,
                borderRadius: 4,
            },
            code_block: {
                backgroundColor: Colors[theme ?? 'light'].inputBackground,
                padding: 8,
                borderRadius: 8,
                marginVertical: 8,
            },
            bullet_list: {
                marginVertical: 8,
            },
        };

        return (
            <ThemedView
                style={[
                    styles.commitItem,
                    { backgroundColor: Colors[theme ?? 'light'].cardBackground }
                ]}
            >
                <ThemedView style={[styles.authorContainer, { backgroundColor: 'transparent' }]}>
                    <Image
                        source={{ uri: item.author?.avatar_url }}
                        style={styles.avatar}
                    />
                    <ThemedView style={[styles.authorInfo, { backgroundColor: 'transparent' }]}>
                        <ThemedText style={styles.authorName}>
                            {item.author?.login || item.commit.author.name}
                        </ThemedText>
                        <ThemedText style={styles.timeAgo}>{relativeTime}</ThemedText>
                    </ThemedView>
                </ThemedView>
                <Markdown
                    style={markdownStyles}
                >
                    {item.commit.message}
                </Markdown>
            </ThemedView>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={commits}
                renderItem={renderCommitItem}
                keyExtractor={(item) => item.sha}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors[theme ?? 'light'].tint}
                    />
                }
                ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    commitItem: {
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeAgo: {
        fontSize: 14,
        opacity: 0.6,
    },
    separator: {
        height: 12,
    },
});
