import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { COLORS } from '../constants/theme';

export default function MapScreen() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const response = await api.get('/api/heritage-sites');
            const validSites = response.data.filter(s => s.latitude && s.longitude);
            setSites(validSites);
        } catch (error) {
            console.error('Error fetching sites for map:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
        );
    }

    const initialRegion = {
        latitude: 10.7828,
        longitude: 78.6876,
        latitudeDelta: 6.0,
        longitudeDelta: 6.0,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {sites.map((site) => (
                    <Marker
                        key={site._id}
                        coordinate={{
                            latitude: parseFloat(site.latitude),
                            longitude: parseFloat(site.longitude),
                        }}
                        title={site.name}
                        description={site.detail + " (Tap for details)"}
                        pinColor={COLORS.orange}
                        onCalloutPress={() => navigation.navigate('SiteDetails', { siteId: site._id })}
                    />
                ))}
            </MapView>
            
            <View style={styles.topHeader}>
                <Text style={styles.headerTitle}>Heritage Map</Text>
                <Text style={styles.headerSub}>{sites.length} sites pinned</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.pageBg },
    topHeader: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
    headerSub: { fontSize: 12, color: COLORS.medium, marginTop: 2 },
});
