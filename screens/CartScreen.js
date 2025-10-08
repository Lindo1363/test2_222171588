import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

export default function CartScreen() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;


  useEffect(() => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in first.');
      return;
    }

    const cartRef = ref(db, 'carts/' + user.uid);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {};
      setCart(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

 
  const updateCart = async (newCart) => {
    const cartRef = ref(db, 'carts/' + user.uid);
    await set(cartRef, newCart);
  };


  const increaseQuantity = (id) => {
    const updated = { ...cart };
    updated[id].quantity += 1;
    updateCart(updated);
  };

 
  const decreaseQuantity = (id) => {
    const updated = { ...cart };
    if (updated[id].quantity > 1) {
      updated[id].quantity -= 1;
    } else {
      delete updated[id]; 
    }
    updateCart(updated);
  };

 
  const getTotal = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading your cart...</Text>
      </View>
    );
  }

  const cartItems = Object.values(cart);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${getTotal()}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', fontSize: 16, color: '#555', marginTop: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  image: { width: 80, height: 80, resizeMode: 'contain', marginRight: 10 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold' },
  price: { color: '#007bff', marginBottom: 5 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  qtyText: { color: '#fff', fontSize: 18 },
  qtyNum: { marginHorizontal: 10, fontSize: 16 },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
