import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase';
import { ref, set, get, child } from 'firebase/database';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params; 
  const [loading, setLoading] = useState(false);

 
  const handleAddToCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to add items to your cart.');
      return;
    }

    setLoading(true);

    try {
      const cartRef = ref(db, 'carts/' + user.uid);
      const snapshot = await get(cartRef);

      let existingCart = {};
      if (snapshot.exists()) {
        existingCart = snapshot.val();
      }

     
      if (existingCart[product.id]) {
        existingCart[product.id].quantity += 1;
      } else {
        existingCart[product.id] = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
      }

      await set(cartRef, existingCart);
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart 🛒</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 18, color: '#007bff', marginBottom: 10 },
  description: { fontSize: 14, color: '#555', marginBottom: 20 },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
