import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';

// Audio and File System pour Expo
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Firebase (La même logique métier)
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, deleteDoc } from 'firebase/firestore';

// Icônes pour React Native
import {
  Play, Pause, SkipForward, SkipBack, MessageSquare, ShieldCheck,
  Edit3, Plus, Trash2, BookOpen, FileText, Check, X, Wand2, List, Type, UploadCloud, Car
} from 'lucide-react-native';

// --- CONFIGURATION FIREBASE ---
// Remplacez par vos vraies clés
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-app.firebaseapp.com",
  projectId: "votre-project-id",
  storageBucket: "votre-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'scholar-drive-mobile-v1';

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const API_KEY = "VOTRE_CLE_GEMINI";

export default function App() {
  const [user, setUser] = useState(null);
  const [blocks, setBlocks] = useState([{ id: 'b1', text: "Introduction", isHeader: true }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation
  const [activeTab, setActiveTab] = useState('editor');
  const [isDrivingMode, setIsDrivingMode] = useState(false);

  // IA
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [aiDiscussion, setAiDiscussion] = useState("");
  const [supervisorCritique, setSupervisorCritique] = useState("");
  const [proposedRewrite, setProposedRewrite] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Audio
  const [sound, setSound] = useState();
  const [isReading, setIsReading] = useState(false);

  // Sources & Import
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ title: '', type: 'Article', content: '' });
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const scrollViewRef = useRef();

  useEffect(() => {
    signInAnonymously(auth).catch(e => console.log("Auth error:", e));
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const qDraft = query(collection(db, 'artifacts', appId, 'users', user.uid, 'drafts'));
    const unsubDraft = onSnapshot(qDraft, (snapshot) => {
      if (!snapshot.empty && snapshot.docs[0].data().blocks) setBlocks(snapshot.docs[0].data().blocks);
    });
    const qSources = query(collection(db, 'artifacts', appId, 'users', user.uid, 'sources'));
    const unsubSources = onSnapshot(qSources, (snapshot) => {
      setSources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubDraft(); unsubSources(); };
  }, [user]);

  // Nettoyage de l'audio lors du démontage
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const saveToCloud = async (newBlocks) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'drafts', 'current_article'), { blocks: newBlocks, updatedAt: Date.now() }, { merge: true });
  };

  const updateBlock = (index, value) => {
    const next = [...blocks]; next[index].text = value;
    setBlocks(next); saveToCloud(next);
  };

  const toggleHeader = (index) => {
    const next = [...blocks]; next[index].isHeader = !next[index].isHeader;
    setBlocks(next); saveToCloud(next);
  };

  const addBlockAfter = (index) => {
    const next = [...blocks];
    next.splice(index + 1, 0, { id: `b-${Date.now()}`, text: "", isHeader: false });
    setBlocks(next); saveToCloud(next);
    scrollToBlock(index + 1);
  };

  const removeBlock = (index) => {
    if (blocks.length <= 1) return;
    const next = blocks.filter((_, i) => i !== index);
    setBlocks(next); saveToCloud(next);
    setCurrentIndex(Math.max(0, index - 1));
  };

  const scrollToBlock = (index) => {
    setCurrentIndex(index);
    setActiveTab('editor');
    // Approximation du scroll: Chaque bloc fait environ 150px de haut
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: index * 150, animated: true });
    }, 100);
  };

  const speak = async (textToSpeak) => {
    if (!textToSpeak) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `D'une voix claire : ${textToSpeak}` }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } }
        })
      });
      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if(base64Audio) {
          // Utilisation de expo-file-system pour sauvegarder l'audio base64
          const uri = FileSystem.cacheDirectory + 'speech.mp3';
          await FileSystem.writeAsStringAsync(uri, base64Audio, { encoding: FileSystem.EncodingType.Base64 });

          const { sound: newSound } = await Audio.Sound.createAsync({ uri });
          setSound(newSound);
          setIsReading(true);

          newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) setIsReading(false);
          });

          await newSound.playAsync();
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const toggleDrivingMode = async () => {
    const next = !isDrivingMode;
    setIsDrivingMode(next);
    setShowAnalysisSheet(false);
    if (next && blocks[currentIndex]) {
      speak(blocks[currentIndex].text);
    } else if (!next && sound) {
      await sound.pauseAsync();
      setIsReading(false);
    }
  };

  const analyzeAndRewrite = async (index) => {
    const block = blocks[index];
    if (!block || block.isHeader) return;

    setShowAnalysisSheet(true);
    setIsLoading(true);
    setAiDiscussion(""); setSupervisorCritique(""); setProposedRewrite("");

    const sourceContext = sources.map(s => `[SOURCE: ${s.title}]: ${s.content}`).join("\n\n");
    const callAI = async (systemPrompt, userQuery) => {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur";
      } catch (e) { return "Erreur réseau."; }
    };

    const [disc, crit, rew] = await Promise.all([
      callAI(`Tu es un assistant littéraire. Questionne l'auteur sur ses intentions en 1 phrase. Sources: ${sourceContext}`, block.text),
      callAI(`Tu es un superviseur académique. Critique la rigueur en 2 phrases brèves. Sources: ${sourceContext}`, block.text),
      callAI(`Réécris ce paragraphe pour un journal scientifique. Ne fournis que le texte. Sources: ${sourceContext}`, block.text)
    ]);

    setAiDiscussion(String(disc)); setSupervisorCritique(String(crit)); setProposedRewrite(String(rew));
    setIsLoading(false);
    if (isDrivingMode) await speak(`Suggestion : ${disc}. Critique : ${crit}.`);
  };

  const applyRewrite = () => {
    if (!proposedRewrite) return;
    updateBlock(currentIndex, proposedRewrite);
    setProposedRewrite("");
    setShowAnalysisSheet(false);
  };

  const handleImport = () => {
    if (!importText) return;
    const lines = importText.split('\n').filter(line => line.trim() !== '');
    const newBlocks = lines.map((line, idx) => ({
      id: `b-${Date.now()}-${idx}`,
      text: line,
      isHeader: line.length < 50 && (line === line.toUpperCase() || line.endsWith(':'))
    }));
    setBlocks(newBlocks);
    saveToCloud(newBlocks);
    setShowImportModal(false);
    setImportText("");
  };

  const handleAddSource = () => {
    if (!newSource.title || !newSource.content) return;
    const src = { id: `src-${Date.now()}`, ...newSource };
    setSources([...sources, src]);
    setNewSource({ title: '', type: 'Article', content: '' });
    setShowSourceModal(false);
  };

  // --- RENDU MODE CONDUITE ---
  if (isDrivingMode) {
    return (
      <SafeAreaView style={[styles.container, styles.drivingBg]}>
        <View style={styles.drivingHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Car color="#3b82f6" size={24} />
            <Text style={styles.drivingTitle}>MODE CONDUITE</Text>
          </View>
          <TouchableOpacity onPress={toggleDrivingMode} style={styles.closeButton}>
            <X color="#fff" size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.drivingContent}>
          <View style={styles.drivingCard}>
            <Text style={styles.drivingCardLabel}>BLOC {currentIndex + 1} / {blocks.length}</Text>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
              <Text style={styles.drivingText}>"{blocks[currentIndex]?.text}"</Text>
            </ScrollView>
          </View>

          <View style={styles.drivingControls}>
            <TouchableOpacity onPress={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} style={styles.drivingSkipBtn}>
              <SkipBack color="#fff" size={40} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                if(isReading && sound) { await sound.pauseAsync(); setIsReading(false); }
                else speak(blocks[currentIndex]?.text);
              }}
              style={styles.drivingPlayBtn}
            >
              {isReading ? <Pause color="#fff" size={48} /> : <Play color="#fff" size={48} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => currentIndex < blocks.length - 1 && setCurrentIndex(currentIndex + 1)} style={styles.drivingSkipBtn}>
              <SkipForward color="#fff" size={40} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => analyzeAndRewrite(currentIndex)}
            disabled={isLoading}
            style={[styles.drivingAnalyzeBtn, isLoading && {backgroundColor: '#78350f'}]}
          >
            <ShieldCheck color="#fff" size={32} />
            <Text style={styles.drivingAnalyzeText}>{isLoading ? "ANALYSE..." : "VÉRIFIER RIGUEUR"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDU PRINCIPAL ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <BookOpen color="#fff" size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>ScholarDrive</Text>
            <Text style={styles.headerSubtitle}>MOBILE EDITOR</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={() => setShowImportModal(true)}>
          <UploadCloud color="#475569" size={20} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.main}
      >
        {activeTab === 'editor' && (
          <ScrollView ref={scrollViewRef} style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {blocks.map((b, i) => (
              <TouchableOpacity
                key={b.id}
                activeOpacity={1}
                onPress={() => setCurrentIndex(i)}
                style={[styles.blockCard, currentIndex === i && styles.blockCardActive]}
              >
                {currentIndex === i && (
                  <View style={styles.blockControls}>
                    <TouchableOpacity onPress={() => toggleHeader(i)} style={[styles.tagBadge, b.isHeader ? styles.tagBadgeBlue : styles.tagBadgeGray]}>
                      <Type color={b.isHeader ? "#1d4ed8" : "#64748b"} size={14} />
                      <Text style={[styles.tagText, b.isHeader ? {color: '#1d4ed8'} : {color: '#64748b'}]}>
                        {b.isHeader ? " Titre" : " Paragraphe"}
                      </Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', gap: 8}}>
                      <TouchableOpacity onPress={() => addBlockAfter(i)} style={styles.btnIconGreen}>
                        <Plus color="#16a34a" size={16} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeBlock(i)} style={styles.btnIconRed}>
                        <Trash2 color="#dc2626" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TextInput
                  style={[styles.textInput, b.isHeader ? styles.textHeader : styles.textParagraph]}
                  multiline
                  value={b.text}
                  onChangeText={(val) => updateBlock(i, val)}
                  placeholder={b.isHeader ? "Titre..." : "Tapez ici..."}
                  placeholderTextColor="#94a3b8"
                />

                {currentIndex === i && !b.isHeader && (
                  <TouchableOpacity onPress={() => analyzeAndRewrite(i)} style={styles.analyzeBtn}>
                    <Wand2 color="#92400e" size={16} />
                    <Text style={styles.analyzeBtnText}> ANALYSER IA</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => addBlockAfter(blocks.length - 1)} style={styles.addBlockBtn}>
              <Plus color="#94a3b8" size={20} />
              <Text style={styles.addBlockText}> NOUVEAU BLOC</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {activeTab === 'outline' && (
          <ScrollView style={styles.scrollArea}>
            <View style={styles.tabHeader}>
              <List color="#64748b" size={16} />
              <Text style={styles.tabHeaderText}> STRUCTURE</Text>
            </View>
            <View style={{padding: 16}}>
              {blocks.filter(b => b.isHeader && b.text.trim() !== "").map((b, i) => (
                <TouchableOpacity key={b.id} onPress={() => scrollToBlock(i)} style={styles.outlineItem}>
                  <Text style={styles.outlineText}>{b.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'sources' && (
          <ScrollView style={styles.scrollArea}>
            <View style={[styles.tabHeader, {flexDirection: 'row', justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FileText color="#64748b" size={16} />
                <Text style={styles.tabHeaderText}> SOURCES ({sources.length})</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSourceModal(true)} style={styles.addSourceBtn}>
                <Plus color="#2563eb" size={18} />
              </TouchableOpacity>
            </View>
            <View style={{padding: 16}}>
              {sources.map(s => (
                <View key={s.id} style={styles.sourceItem}>
                  <View style={{flex: 1}}>
                    <Text style={styles.sourceTitle}>{s.title}</Text>
                    <Text style={styles.sourceContent} numberOfLines={2}>{s.content}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user?.uid, 'sources', s.id))}>
                    <Trash2 color="#cbd5e1" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('editor')}>
          <Edit3 color={activeTab === 'editor' ? "#2563eb" : "#94a3b8"} size={24} />
          <Text style={[styles.navText, activeTab === 'editor' && {color: '#2563eb'}]}>Éditeur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('outline')}>
          <List color={activeTab === 'outline' ? "#2563eb" : "#94a3b8"} size={24} />
          <Text style={[styles.navText, activeTab === 'outline' && {color: '#2563eb'}]}>Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('sources')}>
          <FileText color={activeTab === 'sources' ? "#2563eb" : "#94a3b8"} size={24} />
          <Text style={[styles.navText, activeTab === 'sources' && {color: '#2563eb'}]}>Sources</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={toggleDrivingMode}>
          <View style={styles.navDriveIcon}>
            <Car color="#fff" size={24} />
          </View>
          <Text style={[styles.navText, {marginTop: 20, color: '#0f172a'}]}>Conduite</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Import */}
      <Modal visible={showImportModal} animationType="slide">
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Importer</Text>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <X color="#0f172a" size={24} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.modalTextArea}
            multiline
            placeholder="Collez le texte brut ici..."
            value={importText}
            onChangeText={setImportText}
          />
          <View style={{padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0'}}>
            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleImport}>
              <Text style={styles.modalSubmitText}>STRUCTURER</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal Source */}
      <Modal visible={showSourceModal} animationType="slide">
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouvelle Source</Text>
            <TouchableOpacity onPress={() => setShowSourceModal(false)}>
              <X color="#0f172a" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{padding: 16}}>
            <TextInput
              style={styles.sourceInputTitle}
              placeholder="Titre (ex: Auteur, Année)"
              value={newSource.title}
              onChangeText={t => setNewSource({...newSource, title: t})}
            />
            <TextInput
              style={styles.sourceInputContent}
              multiline
              placeholder="Résumé de la source..."
              value={newSource.content}
              onChangeText={c => setNewSource({...newSource, content: c})}
            />
          </ScrollView>
          <View style={{padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0'}}>
            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddSource}>
              <Text style={styles.modalSubmitText}>SAUVEGARDER</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Bottom Sheet Modal pour IA */}
      <Modal visible={showAnalysisSheet} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Wand2 color="#f59e0b" size={20} />
                <Text style={styles.sheetTitle}> Analyse IA</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAnalysisSheet(false)}>
                <X color="#64748b" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{padding: 20}}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#2563eb" style={{marginTop: 40}} />
              ) : (
                <View>
                  {proposedRewrite ? (
                    <View style={styles.aiBox}>
                      <Text style={styles.aiLabelBlue}>Proposition</Text>
                      <Text style={styles.aiTextBlue}>{proposedRewrite}</Text>
                      <TouchableOpacity style={styles.aiApplyBtn} onPress={applyRewrite}>
                        <Check color="#fff" size={18} />
                        <Text style={{color: '#fff', fontWeight: 'bold', marginLeft: 8}}>REMPLACER</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {supervisorCritique ? (
                    <View style={[styles.aiBox, {backgroundColor: '#fffbeb', borderColor: '#fef3c7'}]}>
                      <Text style={[styles.aiLabelBlue, {color: '#d97706'}]}>Critique</Text>
                      <Text style={{color: '#78350f'}}>{supervisorCritique}</Text>
                    </View>
                  ) : null}

                  {aiDiscussion ? (
                    <View style={[styles.aiBox, {backgroundColor: '#f8fafc', borderColor: '#f1f5f9'}]}>
                      <Text style={[styles.aiLabelBlue, {color: '#64748b'}]}>Réflexion</Text>
                      <Text style={{color: '#475569', fontStyle: 'italic'}}>{aiDiscussion}</Text>
                    </View>
                  ) : null}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 40, height: 40, backgroundColor: '#2563eb', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  headerSubtitle: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1 },
  headerAction: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 12 },

  main: { flex: 1 },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  blockCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderWidth: 2, borderColor: '#f1f5f9', marginBottom: 16 },
  blockCardActive: { borderColor: '#3b82f6', shadowColor: '#3b82f6', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  blockControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f8fafc', paddingBottom: 12, marginBottom: 12 },
  tagBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tagBadgeBlue: { backgroundColor: '#dbeafe' },
  tagBadgeGray: { backgroundColor: '#f1f5f9' },
  tagText: { fontSize: 12, fontWeight: 'bold' },
  btnIconGreen: { padding: 8, backgroundColor: '#dcfce7', borderRadius: 8, marginRight: 8 },
  btnIconRed: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 8 },

  textInput: { textAlignVertical: 'top', color: '#334155' },
  textHeader: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  textParagraph: { fontSize: 16, lineHeight: 24 },

  analyzeBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef3c7', padding: 14, borderRadius: 12 },
  analyzeBtnText: { color: '#92400e', fontWeight: '900', fontSize: 14 },

  addBlockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#e2e8f0', borderRadius: 24 },
  addBlockText: { color: '#94a3b8', fontWeight: 'bold' },

  tabHeader: { padding: 16, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center' },
  tabHeaderText: { fontSize: 12, fontWeight: '900', color: '#64748b', letterSpacing: 1 },
  outlineItem: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 8 },
  outlineText: { fontSize: 14, fontWeight: 'bold', color: '#334155' },

  addSourceBtn: { padding: 8, backgroundColor: '#dbeafe', borderRadius: 8 },
  sourceItem: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  sourceTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  sourceContent: { fontSize: 12, color: '#64748b', marginTop: 4 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 80, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  navItem: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  navText: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', marginTop: 4 },
  navDriveIcon: { position: 'absolute', top: -30, backgroundColor: '#0f172a', padding: 12, borderRadius: 30, borderWidth: 4, borderColor: '#fff' },

  drivingBg: { backgroundColor: '#020617' },
  drivingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  drivingTitle: { color: '#3b82f6', fontWeight: '900', fontSize: 14, letterSpacing: 2, marginLeft: 8 },
  closeButton: { padding: 16, backgroundColor: '#1e293b', borderRadius: 30 },
  drivingContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  drivingCard: { backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: 32, borderRadius: 32, width: '100%', height: '50%', borderWidth: 1, borderColor: '#1e293b' },
  drivingCardLabel: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginBottom: 16 },
  drivingText: { color: '#f1f5f9', fontSize: 24, fontStyle: 'italic', lineHeight: 36, textAlign: 'center' },
  drivingControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginVertical: 40 },
  drivingSkipBtn: { padding: 24, backgroundColor: '#0f172a', borderRadius: 28 },
  drivingPlayBtn: { padding: 32, backgroundColor: '#2563eb', borderRadius: 32 },
  drivingAnalyzeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d97706', padding: 24, borderRadius: 28, width: '100%' },
  drivingAnalyzeText: { color: '#fff', fontWeight: '900', fontSize: 20, marginLeft: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.3)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '80%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  aiBox: { backgroundColor: '#eff6ff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#dbeafe', marginBottom: 16 },
  aiLabelBlue: { fontSize: 10, fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  aiTextBlue: { color: '#1e3a8a', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  aiApplyBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  modalTextArea: { flex: 1, padding: 16, fontSize: 16, color: '#334155', textAlignVertical: 'top' },
  modalSubmitBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, alignItems: 'center' },
  modalSubmitText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  sourceInputTitle: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, fontWeight: 'bold', fontSize: 16, marginBottom: 16 },
  sourceInputContent: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, fontSize: 16, height: 200, textAlignVertical: 'top' }
});
