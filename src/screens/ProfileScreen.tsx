import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedContainer } from '../components/ThemedContainer';
import { AppButton } from '../components/AppButton';
import { useGamification } from '../context/GamificationContext';
import { THEMES } from '../constants/theme';
import { supabase } from '../services/supabase';

interface ProfileScreenProps {
    onNavigate?: (screen: 'Auth') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
    const { userData, updateProfile } = useGamification();
    const currentThemeId = userData.equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Auth State
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userData.name || 'Focus Master');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(userData.avatarUri || 'https://github.com/shadcn.png');
    const [bio, setBio] = useState('');
    const [instagram, setInstagram] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
        });
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (data) {
                setName(data.full_name || '');
                setUsername(data.username || '');
                setAvatar(data.avatar_url || '');
                setBio(data.bio || '');
                setInstagram(data.links?.instagram || '');
                updateProfile(data.full_name, data.avatar_url); // Sync local context
            }
        } catch (error) {
            console.log('Error fetching profile:', error);
        }
    };

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                if (password.length < 6) throw new Error("Password must be at least 6 characters.");
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            avatar_url: avatar,
                        }
                    }
                });
                if (error) throw error;
                Alert.alert('Success', 'Account created! You can now login.');
                setIsLogin(true);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const updates = {
                id: session.user.id,
                full_name: name,
                username,
                avatar_url: avatar,
                bio,
                links: { instagram },
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            updateProfile(name, avatar);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    if (!session) {
        return (
            <ThemedContainer>
                <View style={styles.container}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </Text>

                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.label, { color: theme.colors.secondary }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <Text style={[styles.label, { color: theme.colors.secondary, marginTop: 20 }]}>Password</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <AppButton
                            title={loading ? "Loading..." : (isLogin ? "LOGIN" : "REGISTER")}
                            onPress={handleAuth}
                            style={{ marginTop: 30 }}
                            disabled={loading}
                        />
                    </View>

                    <AppButton
                        title={isLogin ? "Need an account? Register" : "Have an account? Login"}
                        onPress={() => setIsLogin(!isLogin)}
                        variant="text"
                        style={{ marginTop: 20 }}
                    />
                </View>
            </ThemedContainer>
        );
    }

    return (
        <ThemedContainer>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image source={{ uri: avatar }} style={[styles.avatar, { borderColor: theme.colors.primary }]} />
                    <View style={styles.headerInfo}>
                        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
                        <Text style={[styles.username, { color: theme.colors.secondary }]}>@{username || 'username'}</Text>
                        <Text style={[styles.level, { color: theme.colors.primary }]}>Level {userData.level}</Text>
                    </View>
                </View>

                {isEditing ? (
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Edit Profile</Text>

                        <Text style={[styles.label, { color: theme.colors.secondary }]}>Display Name</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondary, marginTop: 15 }]}>Username</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondary, marginTop: 15 }]}>Avatar URL</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={avatar}
                            onChangeText={setAvatar}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondary, marginTop: 15 }]}>Bio</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary, height: 80 }]}
                            value={bio}
                            onChangeText={setBio}
                            multiline
                        />

                        <Text style={[styles.label, { color: theme.colors.secondary, marginTop: 15 }]}>Instagram Link</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.secondary }]}
                            value={instagram}
                            onChangeText={setInstagram}
                            placeholder="https://instagram.com/..."
                            placeholderTextColor="#666"
                        />

                        <View style={styles.editButtons}>
                            <AppButton title="Cancel" onPress={() => setIsEditing(false)} variant="secondary" style={{ flex: 1, marginRight: 10 }} />
                            <AppButton title="Save" onPress={handleSaveProfile} style={{ flex: 1 }} disabled={loading} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.statsContainer}>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{userData.pomodorosCompleted}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>Pomodoros</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{userData.minutesFocused}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>Minutes</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{userData.xp}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>XP</Text>
                        </View>
                    </View>
                )}

                {!isEditing && (
                    <>
                        {bio ? <Text style={[styles.bio, { color: theme.colors.text }]}>{bio}</Text> : null}

                        <AppButton title="Edit Profile" onPress={() => setIsEditing(true)} variant="outline" style={{ marginTop: 20 }} />
                        <AppButton title="Logout" onPress={handleLogout} variant="text" style={{ marginTop: 10 }} />
                    </>
                )}

            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 20,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
    },
    headerInfo: {
        marginLeft: 20,
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 16,
        marginBottom: 5,
    },
    level: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    editButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    bio: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },
});
