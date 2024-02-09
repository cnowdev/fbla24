import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const faqs = [
  { id: '1', question: 'How do I log in?', answer: 'Navigate to the log-in page and enter your log in details.' },
  { id: '2', question: 'How do I sign up?', answer: 'Navigate to the sign-up page and enter the required details' },
  { id: '9', question: 'How do I sign out?', answer: 'Navigate to the profile page and the sign out button is on top.' },
  { id: '3', question: 'Where can I update my profile?', answer: 'Navigate to your profile tab and clicke the "edit" button on the field you want to edit.' },
  { id: '4', question: 'How do I post?', answer: 'Navigate to the post screen and press the post button.' },
  { id: '5', question: 'How do I share a post?', answer: 'Press the share button for the post you want to share.' },
  { id: '6', question: 'How do I like a post?', answer: 'Press the like button for the post you want to like.' },
  { id: '7', question: 'How do I reply to a post?', answer: 'Press the reply button for the post you want to reply to.' },
  { id: '8', question: 'How do I search for a post?', answer: 'Navigate to the search tab and enter the search query.' },];

const FAQPage = () => {
  // Initialize an object to keep track of toggled FAQs
  const [toggledFAQs, setToggledFAQs] = useState({});

  const toggleFAQ = (id:any) => {
    // Toggle the FAQ by ID
    setToggledFAQs(prevState => ({
      ...prevState,
      // @ts-ignore
      [id]: !prevState[id],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq) => (
        <TouchableOpacity key={faq.id} onPress={() => toggleFAQ(faq.id)} style={styles.faqItem}>
          <Text style={styles.question}>{faq.question}</Text>
          { // @ts-ignore
          toggledFAQs[faq.id] && <Text style={styles.answer}>{faq.answer}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5f9ea0',
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5f9ea0',
  },
  question: {
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    marginTop: 5,
    color: '#666',
  },
});

export default FAQPage;
